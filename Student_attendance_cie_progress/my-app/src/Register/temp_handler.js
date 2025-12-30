import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StudentRegister.css";
import storage from "../utils/storage";

// Mock data - In real app, this would come from backend/context
const PROCTORS = [
    { id: "p1", name: "Dr. Raj Kumar", email: "raj@uni.edu", role: "proctor", department: "Computer Science" },
    { id: "p2", name: "Dr. Meena Sharma", email: "meena@uni.edu", role: "proctor", department: "Information Technology" },
    { id: "p3", name: "Prof. Anil Patel", email: "anil@uni.edu", role: "faculty", department: "Electronics" }, // Not a proctor
    { id: "p4", name: "Dr. Priya Singh", email: "priya@uni.edu", role: "proctor", department: "Computer Science" },
    { id: "p5", name: "Prof. Robert Johnson", email: "robert@uni.edu", role: "faculty", department: "Software Engineering" } // Not a proctor
];

// Subjects by semester (1-8)
const SUBJECTS_BY
