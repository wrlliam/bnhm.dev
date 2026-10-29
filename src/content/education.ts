export type Education = {
  place: string;
  award: string;
  period: string;
  notes: string[];
};

export type Certification = { name: string; date: string };

export const education: Education[] = [
  {
    place: "University of Lincoln",
    award: "Bachelor’s in Computer Science",
    period: "Sep 2026 – present · First year",
    notes: [
      "Modules: Fundamentals of Programming, Computer Architecture, Software Engineering, Cyber Security, AI, Cloud Computing.",
    ],
  },
  {
    place: "Burton and South Derbyshire College",
    award: "BTEC Extended Diploma, Application Development and Data Technician",
    // TODO(william): confirm the end date now you have started at Lincoln.
    period: "Sep 2024 – present",
    notes: ["Predicted D*D*D.", "Also tutored and supported fellow students."],
  },
  {
    place: "The Pingle Academy",
    award: "GCSEs",
    period: "Sep 2022 – Jun 2024",
    notes: [
      "Computer Science, Physics, Business, Maths, English, Geography, Biology, Chemistry.",
    ],
  },
];

export const certifications: Certification[] = [
  {
    name: "WorldSkills UK National Competitions, Silver Medallist 2025",
    date: "Dec 2025",
  },
  { name: "Cisco JavaScript Essentials 1 and 2", date: "Oct 2024" },
  { name: "Cisco Computer Hardware Basics", date: "Nov 2024" },
];
