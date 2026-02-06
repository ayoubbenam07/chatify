import Message from "../models/Message.js"
import User from "../models/User.js"
import cloudinary from "../lib/cloudinary.js"

export const getAllContacts = async (req, res) => {
    try {
        const loggedinUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedinUserId } }).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("error in gatAllContacts controller", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
    try {
        const loggedinUserId = req.user._id
        const partnerId = req.params.id
        const messages = await Message.find({ $or: [{ senderId: loggedinUserId, receiverId: partnerId }, { senderId: partnerId, receiverId: loggedinUserId }] })
        res.status(200).json(messages)
    } catch (error) {
        console.error("error in getMessagesByUserId controller", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const receiverId = req.params.id
        const senderId = req.user._id
        const { text, image } = req.body

        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        let imageUrl

        if(image){
            imageUrl = (await cloudinary.uploader.upload(image)).secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        return res.status(201).json({message: "message sent successful"})

    } catch (error) {
        console.error("error in sendMessage controller", error)
        res.status(500).json({ message: "Internal server error" })
    }
} 