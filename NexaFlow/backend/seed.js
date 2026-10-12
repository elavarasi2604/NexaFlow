import "dotenv/config";
import mongoose from "mongoose";
import Task from "./models/Task.js";
import Message from "./models/Message.js";
import Notification from "./models/Notification.js";
import TeamMember from "./models/TeamMember.js";
import Setting from "./models/Setting.js";

await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nexaflow");

await Promise.all([
  Task.deleteMany({}),
  Message.deleteMany({}),
  Notification.deleteMany({}),
  TeamMember.deleteMany({}),
  Setting.deleteMany({})
]);

await Task.insertMany([
  {title:"Review project documentation",description:"Check the latest workflow documentation and update missing sections.",status:"In Progress",priority:"High",dueDate:"2026-10-05"},
  {title:"Prepare weekly report",description:"Compile completed tasks and pending work for the weekly report.",status:"Pending",priority:"Medium",dueDate:"2026-10-07"},
  {title:"Team stand-up",description:"Review blockers and assign the next set of workflow tasks.",status:"Completed",priority:"Low",dueDate:"2026-10-02"},
  {title:"Upload project documents",description:"Organize and upload final project documents.",status:"Pending",priority:"High",dueDate:"2026-10-09"}
]);

await Message.create({name:"Project Team",text:"Welcome to NexaFlow communication.",time:"10:20 AM"});

await Notification.insertMany([
  {title:"Task deadline approaching",text:"Prepare weekly report is due soon.",time:"Today",read:false},
  {title:"Task completed",text:"Team stand-up was completed.",time:"Today",read:false},
  {title:"New workflow update",text:"Your task dashboard was refreshed.",time:"Yesterday",read:true}
]);

await TeamMember.insertMany([
  {name:"Elavarasi",role:"Project Lead",initial:"E"},
  {name:"Harsha",role:"Developer",initial:"H"},
  {name:"Vardhini",role:"Designer",initial:"V"}
]);

await Setting.create({key:"workspace",name:"Elavarasi",email:"elavarasi@example.com",role:"User"});

console.log("NexaFlow MongoDB seed complete.");
await mongoose.disconnect();
