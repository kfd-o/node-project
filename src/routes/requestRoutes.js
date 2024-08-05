import requestController from "../controller/requestController.js";
import express from "express";

const router = express.Router();

router.get("/request-visit/:homeownerId", requestController.fetchRequestVisit);
router.get(
  "/request-visit/fetch-visitor-homeowner/id",
  requestController.fetchRequestVisitVisitorHomeownerId
);
router.get(
  "/request-visit/fetch-id/:id",
  requestController.fetchRequestVisitById
);
router.get(
  "/request-visit/notification-count/:homeownerId",
  requestController.fetchRequestVisitCount
);

router.post("/request-visit/:visitType", requestController.requestVisit);

router.patch(
  "/request-visit/is-read/:visitorId/:homeownerId",
  requestController.updateRequestVisitAsRead
);
router.patch(
  "/request-visit/approved/:visitorId/:homeownerId",
  requestController.updateRequestVisitAsApproved
);

export default router;
