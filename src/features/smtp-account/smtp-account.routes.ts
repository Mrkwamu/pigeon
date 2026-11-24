import { Router } from "express";
import {
  createSMTPAccountController,
  updateSMTPAccountPasswordController,
} from "./smtp-acccount.controller.js";

const router = Router();

router.post("/", createSMTPAccountController);
router.patch("/password", updateSMTPAccountPasswordController);

export default router;
