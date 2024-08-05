import { getConnection, releaseConnection } from "../utils/connection.js";
import {
  requestVisit,
  fetchRequestVisit,
  fetchRequestVisitCount,
  updateVisitRequestAsRead,
  updateVisitRequestAsApproved,
  fetchRequestVisitById,
  fetchLastRequestVisit,
  fetchRequestVisitVisitorHomeownerId,
} from "../models/userModel.js";
import { io } from "../../server.js";

const requestController = {
  requestVisit: async (req, res, next) => {
    const {
      visitor_id,
      homeowner_id,
      contact_num,
      classify_as,
      contract_start_date,
      contract_end_date,
      date_of_visit,
      time_of_visit,
    } = req.body;

    if (
      !visitor_id ||
      !homeowner_id ||
      !contact_num ||
      !classify_as ||
      !contract_start_date ||
      !contract_end_date ||
      !date_of_visit ||
      !time_of_visit
    ) {
      return res.status(400).json({ error: "All fields must be filled." });
    }

    const requestData = {
      visitor_id: visitor_id,
      homeowner_id: homeowner_id,
      contact_num: contact_num,
      classify_as: classify_as,
      contract_start_date: contract_start_date,
      contract_end_date: contract_end_date,
      date_of_visit: date_of_visit,
      time_of_visit: time_of_visit,
    };

    try {
      req.conn = await getConnection();

      const [result] = await requestVisit(requestData);

      if (result.affectedRows === 0) {
        return res
          .status(400)
          .json({ status: 400, msg: "Request visit creation failed." });
      }

      const newNotification = await fetchLastRequestVisit(homeowner_id);
      const newNotificationCount = await fetchRequestVisitCount(homeowner_id);

      io.emit("new-notification", newNotification);
      io.emit("new-notification-count", newNotificationCount);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    } finally {
      await releaseConnection(req);
    }
  },
  fetchRequestVisitVisitorHomeownerId: async (req, res, next) => {
    try {
      req.conn = await getConnection();

      const rows = await fetchRequestVisitVisitorHomeownerId();

      if (rows.length === 0) {
        return res
          .status(400)
          .json({ status: 400, msg: "fetch request visit failed." });
      }

      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      await releaseConnection(req);
    }
  },
  fetchRequestVisit: async (req, res, next) => {
    const { homeownerId } = req.params;

    try {
      req.conn = await getConnection();

      const rows = await fetchRequestVisit(homeownerId);

      if (rows.length === 0) {
        return res
          .status(400)
          .json({ status: 400, msg: "fetch request visit failed." });
      }

      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      await releaseConnection(req);
    }
  },
  fetchRequestVisitCount: async (req, res, next) => {
    const { homeownerId } = req.params;

    try {
      req.conn = await getConnection();

      const rows = await fetchRequestVisitCount(homeownerId);

      if (rows.length === 0) {
        return res
          .status(400)
          .json({ status: 400, msg: "fetch request visit failed." });
      }

      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      await releaseConnection(req);
    }
  },
  fetchRequestVisitById: async (req, res, next) => {
    const { id } = req.params;

    try {
      req.conn = await getConnection();

      const rows = await fetchRequestVisitById(id);

      if (rows.length === 0) {
        return res
          .status(400)
          .json({ status: 400, msg: "fetch request visit failed." });
      }

      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      next(error);
    } finally {
      await releaseConnection(req);
    }
  },
  updateRequestVisitAsRead: async (req, res, next) => {
    const { visitorId, homeownerId } = req.params;
    console.log(visitorId);
    console.log(homeownerId);

    try {
      req.conn = await getConnection();

      const result = await updateVisitRequestAsRead(visitorId, homeownerId);

      if (result.affectedRows === 0) {
        return res
          .status(400)
          .json({ status: 400, msg: "Request visit creation failed." });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      next(error);
    } finally {
      await releaseConnection(req);
    }
  },
  updateRequestVisitAsApproved: async (req, res, next) => {
    const { visitorId, homeownerId } = req.params;
    console.log(visitorId);
    console.log(homeownerId);

    try {
      req.conn = await getConnection();

      const result = await updateVisitRequestAsApproved(visitorId, homeownerId);

      if (result.affectedRows === 0) {
        return res
          .status(400)
          .json({ status: 400, msg: "Request visit creation failed." });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      next(error);
    } finally {
      await releaseConnection(req);
    }
  },
};

export default requestController;
