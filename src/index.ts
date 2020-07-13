import fs from "fs";
import path from "path";

const studentData = fs.readFileSync("students.csv", {encoding: "utf-8"});
const studentParsed = studentData.split("\n");

const attendanceFiles = fs.readdirSync("attendance");

let output = ",";
const students = [];

for (const student of studentParsed) {
  const data = student.split(",");
  
  const studentID = data[0].trim();
  const studentName = data[1].trim();

  students.push({
    id: studentID,
    name: studentName
  });

  output += studentID+" "+studentName+",";
}
output += "\n";

students.sort();

for (const attendanceFile of attendanceFiles) {
  const chatData = fs.readFileSync(path.join("attendance", attendanceFile), {encoding: "utf16le"});
  output += attendanceFile.split(".")[0]+",";
  console.log(attendanceFile+":");

  for (let i = 0; i < students.length; i++) {
    const student = students[i];

    const studentRegex = student.id+"( |)"+student.name;
    const regex = new RegExp(studentRegex, "g");
  
    if (!regex.test(chatData)) {
      console.error("Student "+student.id+" "+student.name+" not found!");
      output += "결석,";
    } else {
      output += "출석,";
    }
  }

  output += "\n";
  console.log();
}

output.normalize("NFC");
fs.writeFileSync("final.csv", output, {encoding: "utf-8"});
