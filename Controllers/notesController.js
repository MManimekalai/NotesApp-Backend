const { User, decodeJwtToken } = require("../Models/User.js");
const { Notes } = require("../Models/Notes.js");
const { MailSender } = require("../mailer.js");

const addNotes = async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    await new Notes({
      head: req.body.head,
      data: req.body.data,
      deadline: req.body.deadline,
      user: userId,
    }).save();

    res.status(200).json({ message: "Notes Added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getNotesDataById = async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    let id = req.headers["id"];
    let notes = await Notes.findById({ _id: id });

    res.status(200).json({ message: "Notes Data Got Successfully", notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllNotes = async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    let notes = await Notes.aggregate([
      {
        $match: { user: userId },
      },
    ]);
    res.status(200).json({ message: "Notes Data Got Successfully", notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateNotes = async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    let id = req.headers["id"];
    await Notes.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          head: req.body.head,
          data: req.body.data,
          deadline: req.body.deadline,
          user: userId,
        },
      }
    );
    res.status(200).json({ message: "Notes Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    let id = req.headers["id"];
    let notes = await Notes.findById({ _id: id });
    let status = notes.status == true ? false : true;

    await Notes.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          status,
        },
      }
    );
    res.status(200).json({ message: "Notes Status Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteNotes = async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    let id = req.headers["id"];
    await Notes.findByIdAndDelete({ _id: id });

    res.status(200).json({ message: "Notes Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendReminders = async (req, res) => {
  try {
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    let id = req.headers["id"];
    let notes = await Notes.findById({ _id: id });
    let deadline = notes.deadline.split("/").join("-");

    let mailData = {
      email: user.email,
      subject: "Task Reminder",
      message: `This is a reminder for your ${notes.head} task`,
    };

    const taskDeadline = new Date(deadline);
    const currentDate = new Date();

    if (currentDate < taskDeadline) {
      await MailSender({ data: mailData });
      res.status(200).json({ message: "Reminder sent successfully." });
    } else {
      res
        .status(200)
        .json({ message: "Task deadline has passed. No reminder sent." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addNotes,
  getNotesDataById,
  getAllNotes,
  updateNotes,
  updateStatus,
  deleteNotes,
  sendReminders,
};
