const express = require("express");
const {
  addNotes,
  getNotesDataById,
  getAllNotes,
  updateNotes,
  updateStatus,
  deleteNotes,
  sendReminders,
} = require("../Controllers/notesController");

let router = express.Router();

router.post("/add-notes", addNotes);
router.get("/get-notes-data-by-id", getNotesDataById);
router.get("/note/get-all-notes", getAllNotes);
router.put("/update-notes", updateNotes);
router.put("/update-status", updateStatus);
router.delete("/delete-notes", deleteNotes);
router.post("/send-reminders", sendReminders);

module.exports = router;
