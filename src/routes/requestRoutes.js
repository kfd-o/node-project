import requestController from "../controller/requestController.js";
import express from "express";

const router = express.Router();

router.get(
  "/homeowner-notification/:homeownerId",
  requestController.fetchHomeownerNotification
);
router.get(
  "/request-visit/fetch-visitor-homeowner/id",
  requestController.fetchRequestVisitVisitorHomeownerId
);
router.get("/request-visit/fetch/:id", requestController.fetchRequestVisitById);
router.get(
  "/request-visit/notification-count/:homeownerId",
  requestController.fetchRequestVisitCount
);

router.post("/request-visit/:visitType", requestController.requestVisit);

router.patch(
  "/request-visit/is-read/:homeownerId",
  requestController.updateRequestVisitAsRead
);
router.patch(
  "/request-visit/approved/:requestVisitId",
  requestController.updateRequestVisitAsApproved
);

export default router;
