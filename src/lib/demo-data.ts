/**
 * VisionTrack sample dataset.
 *
 * Every record below is fictional and exists only to demonstrate the product
 * surface. No real person, case, or investigation is represented.
 */

export type CaseStatus = "Active" | "Under Review" | "Potential Match" | "Resolved" | "Archived";
export type CasePriority = "Low" | "Medium" | "High" | "Critical";
export type TeamRole = "Administrator" | "Investigator" | "Reviewer" | "Coordinator" | "Viewer";
export type EvidenceType = "Image" | "Video" | "Document" | "Location" | "Note";

export interface MissingPerson {
  fullName: string;
  age: number;
  gender: string;
  height: string;
  hair: string;
  clothing: string;
  distinguishingFeatures: string;
  accessories: string;
}

export interface CaseRecord {
  id: string;
  person: MissingPerson;
  lastSeenLocation: string;
  lastSeenAt: string;
  status: CaseStatus;
  priority: CasePriority;
  assignedTeam: string;
  assignees: string[];
  createdAt: string;
  updatedAt: string;
  circumstances: string;
  notes: string;
  emergencyContact: { name: string; relation: string; phone: string };
  coordinates: { x: number; y: number };
  searchRadiusKm: number;
  referenceImages: number;
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  type: EvidenceType;
  title: string;
  uploadedBy: string;
  uploadedAt: string;
  location: string;
  status: "Verified" | "Pending Review" | "Flagged";
  sizeLabel: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  date: string;
  time: string;
  user: string;
  action: string;
  detail: string;
}

export interface PotentialMatch {
  id: string;
  caseId: string;
  rank: number;
  similarity: number;
  source: string;
  location: string;
  timestamp: string;
  distanceKm: number;
  status: "Awaiting Review" | "In Review" | "Saved Lead" | "Dismissed";
  reviewer?: string;
  coordinates: { x: number; y: number };
}

export interface AlertItem {
  id: string;
  category: "Cases" | "Evidence" | "Team";
  urgent: boolean;
  title: string;
  detail: string;
  caseId?: string;
  at: string;
  read: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: "Active" | "Invited" | "Suspended";
  assignedCases: number;
  lastActive: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  caseId?: string;
  object: string;
  metadata: string;
}

export const DEMO_NOTICE =
  "Sample data. VisionTrack is a coordination and review tool — it does not confirm identity and does not replace law enforcement, emergency services, or human judgement.";

export const cases: CaseRecord[] = [
  {
    id: "VT-1042",
    person: {
      fullName: "Nadia Farouk",
      age: 27,
      gender: "Female",
      height: "168 cm",
      hair: "Dark brown, shoulder length",
      clothing: "Olive canvas jacket, black jeans, white trainers",
      distinguishingFeatures: "Small scar on left wrist",
      accessories: "Grey backpack, silver wristwatch",
    },
    lastSeenLocation: "Corniche District, Alexandria",
    lastSeenAt: "2026-08-14T19:40:00Z",
    status: "Potential Match",
    priority: "Critical",
    assignedTeam: "Coastal Response Unit",
    assignees: ["Ahmed Selim", "Dalia Moussa"],
    createdAt: "2026-08-15T06:12:00Z",
    updatedAt: "2026-08-20T14:05:00Z",
    circumstances:
      "Did not arrive at a scheduled family meeting. Phone last connected to a public network near the seafront promenade.",
    notes: "Family reports no prior missing episodes. Transit CCTV request submitted through authorized channel.",
    emergencyContact: { name: "Hala Farouk", relation: "Sister", phone: "+20 100 000 0000" },
    coordinates: { x: 38, y: 42 },
    searchRadiusKm: 4,
    referenceImages: 4,
  },
  {
    id: "VT-1039",
    person: {
      fullName: "Youssef Adel",
      age: 15,
      gender: "Male",
      height: "172 cm",
      hair: "Black, short",
      clothing: "Navy school hoodie, grey tracksuit trousers",
      distinguishingFeatures: "Braces, birthmark on right cheek",
      accessories: "Blue school bag",
    },
    lastSeenLocation: "Nasr City, Cairo",
    lastSeenAt: "2026-08-17T15:10:00Z",
    status: "Active",
    priority: "High",
    assignedTeam: "Metro Search Team",
    assignees: ["Mariam Khaled"],
    createdAt: "2026-08-17T18:02:00Z",
    updatedAt: "2026-08-20T09:30:00Z",
    circumstances: "Left school at normal hours, did not return home. Two friends reported he mentioned a bus terminal.",
    notes: "Bus terminal coordinator contacted. Awaiting authorized footage release.",
    emergencyContact: { name: "Adel Rashad", relation: "Father", phone: "+20 100 000 0001" },
    coordinates: { x: 62, y: 30 },
    searchRadiusKm: 6,
    referenceImages: 3,
  },
  {
    id: "VT-1036",
    person: {
      fullName: "Sara Mahmoud",
      age: 34,
      gender: "Female",
      height: "160 cm",
      hair: "Auburn, tied back",
      clothing: "Beige coat, dark trousers",
      distinguishingFeatures: "Wears prescription glasses",
      accessories: "Brown leather handbag",
    },
    lastSeenLocation: "Sidi Gaber Station, Alexandria",
    lastSeenAt: "2026-08-11T08:20:00Z",
    status: "Under Review",
    priority: "Medium",
    assignedTeam: "Coastal Response Unit",
    assignees: ["Dalia Moussa", "Omar Nabil"],
    createdAt: "2026-08-11T12:44:00Z",
    updatedAt: "2026-08-19T17:12:00Z",
    circumstances: "Boarded a regional train; did not arrive at destination station.",
    notes: "Two potential matches dismissed after reviewer comparison.",
    emergencyContact: { name: "Mahmoud Fathy", relation: "Brother", phone: "+20 100 000 0002" },
    coordinates: { x: 44, y: 52 },
    searchRadiusKm: 9,
    referenceImages: 2,
  },
  {
    id: "VT-1031",
    person: {
      fullName: "Karim Bassiouny",
      age: 61,
      gender: "Male",
      height: "175 cm",
      hair: "Grey, thinning",
      clothing: "Light blue shirt, dark grey trousers",
      distinguishingFeatures: "Walks with a cane; memory condition on record",
      accessories: "Wooden walking cane",
    },
    lastSeenLocation: "Zamalek, Cairo",
    lastSeenAt: "2026-08-05T11:05:00Z",
    status: "Resolved",
    priority: "Low",
    assignedTeam: "Metro Search Team",
    assignees: ["Mariam Khaled", "Ahmed Selim"],
    createdAt: "2026-08-05T13:20:00Z",
    updatedAt: "2026-08-08T10:15:00Z",
    circumstances: "Left a residential building unaccompanied during afternoon hours.",
    notes: "Located safely by a community search volunteer; case closed with family confirmation.",
    emergencyContact: { name: "Nour Bassiouny", relation: "Daughter", phone: "+20 100 000 0003" },
    coordinates: { x: 55, y: 44 },
    searchRadiusKm: 2,
    referenceImages: 2,
  },
  {
    id: "VT-1027",
    person: {
      fullName: "Laila Hussein",
      age: 22,
      gender: "Female",
      height: "165 cm",
      hair: "Black, curly",
      clothing: "Denim jacket, red scarf",
      distinguishingFeatures: "Tattoo of a small bird on right forearm",
      accessories: "Canvas tote bag",
    },
    lastSeenLocation: "Tanta City Centre",
    lastSeenAt: "2026-07-28T21:00:00Z",
    status: "Archived",
    priority: "Medium",
    assignedTeam: "Delta Coordination",
    assignees: ["Omar Nabil"],
    createdAt: "2026-07-29T07:00:00Z",
    updatedAt: "2026-08-12T08:00:00Z",
    circumstances: "Reported by a family member after missing two scheduled appointments.",
    notes: "Case archived pending new authorized evidence.",
    emergencyContact: { name: "Hussein Adly", relation: "Father", phone: "+20 100 000 0004" },
    coordinates: { x: 50, y: 22 },
    searchRadiusKm: 5,
    referenceImages: 1,
  },
  {
    id: "VT-1022",
    person: {
      fullName: "Tarek Fahmy",
      age: 41,
      gender: "Male",
      height: "180 cm",
      hair: "Black, beard",
      clothing: "Grey work overalls",
      distinguishingFeatures: "Burn scar on left hand",
      accessories: "Tool bag",
    },
    lastSeenLocation: "Port Said Industrial Zone",
    lastSeenAt: "2026-07-19T06:30:00Z",
    status: "Active",
    priority: "High",
    assignedTeam: "Delta Coordination",
    assignees: ["Ahmed Selim"],
    createdAt: "2026-07-19T15:00:00Z",
    updatedAt: "2026-08-18T11:40:00Z",
    circumstances: "Did not report for a scheduled shift; employer filed an authorized report.",
    notes: "Site access logs requested from facility operator.",
    emergencyContact: { name: "Rana Fahmy", relation: "Spouse", phone: "+20 100 000 0005" },
    coordinates: { x: 72, y: 18 },
    searchRadiusKm: 12,
    referenceImages: 2,
  },
];

export const evidence: EvidenceItem[] = [
  { id: "EV-4821", caseId: "VT-1042", type: "Image", title: "Reference portrait — family supplied", uploadedBy: "Dalia Moussa", uploadedAt: "2026-08-15T07:02:00Z", location: "Alexandria", status: "Verified", sizeLabel: "2.4 MB" },
  { id: "EV-4822", caseId: "VT-1042", type: "Image", title: "Promenade frame 19:36", uploadedBy: "Ahmed Selim", uploadedAt: "2026-08-16T10:20:00Z", location: "Corniche District", status: "Verified", sizeLabel: "1.1 MB" },
  { id: "EV-4823", caseId: "VT-1042", type: "Video", title: "Authorized venue clip (4 min)", uploadedBy: "Ahmed Selim", uploadedAt: "2026-08-16T11:05:00Z", location: "Corniche District", status: "Pending Review", sizeLabel: "184 MB" },
  { id: "EV-4824", caseId: "VT-1042", type: "Document", title: "Family statement transcript", uploadedBy: "Dalia Moussa", uploadedAt: "2026-08-15T09:44:00Z", location: "—", status: "Verified", sizeLabel: "68 KB" },
  { id: "EV-4825", caseId: "VT-1042", type: "Location", title: "Last confirmed network ping", uploadedBy: "System", uploadedAt: "2026-08-15T06:20:00Z", location: "31.21 N, 29.92 E", status: "Verified", sizeLabel: "—" },
  { id: "EV-4830", caseId: "VT-1039", type: "Image", title: "School gate reference photo", uploadedBy: "Mariam Khaled", uploadedAt: "2026-08-17T19:00:00Z", location: "Nasr City", status: "Verified", sizeLabel: "1.8 MB" },
  { id: "EV-4831", caseId: "VT-1039", type: "Note", title: "Friend interview summary", uploadedBy: "Mariam Khaled", uploadedAt: "2026-08-18T08:15:00Z", location: "Nasr City", status: "Pending Review", sizeLabel: "—" },
  { id: "EV-4835", caseId: "VT-1036", type: "Image", title: "Station platform still", uploadedBy: "Omar Nabil", uploadedAt: "2026-08-12T14:00:00Z", location: "Sidi Gaber", status: "Flagged", sizeLabel: "900 KB" },
  { id: "EV-4836", caseId: "VT-1036", type: "Document", title: "Ticket record extract", uploadedBy: "Dalia Moussa", uploadedAt: "2026-08-12T15:30:00Z", location: "—", status: "Verified", sizeLabel: "42 KB" },
  { id: "EV-4840", caseId: "VT-1022", type: "Image", title: "Facility entrance frame", uploadedBy: "Ahmed Selim", uploadedAt: "2026-08-02T09:10:00Z", location: "Port Said", status: "Pending Review", sizeLabel: "1.3 MB" },
  { id: "EV-4841", caseId: "VT-1031", type: "Note", title: "Volunteer sighting report", uploadedBy: "Mariam Khaled", uploadedAt: "2026-08-07T16:40:00Z", location: "Zamalek", status: "Verified", sizeLabel: "—" },
];

export const timeline: TimelineEvent[] = [
  { id: "TL-1", caseId: "VT-1042", date: "2026-08-15", time: "06:12", user: "Dalia Moussa", action: "Case created", detail: "Case VT-1042 opened under Coastal Response Unit." },
  { id: "TL-2", caseId: "VT-1042", date: "2026-08-15", time: "07:02", user: "Dalia Moussa", action: "Reference images uploaded", detail: "4 authorized reference images attached." },
  { id: "TL-3", caseId: "VT-1042", date: "2026-08-16", time: "11:05", user: "Ahmed Selim", action: "Evidence added", detail: "EV-4823 venue clip submitted for review." },
  { id: "TL-4", caseId: "VT-1042", date: "2026-08-18", time: "09:20", user: "Ahmed Selim", action: "Visual search initiated", detail: "Search job SJ-2291 across authorized evidence, 4 km radius." },
  { id: "TL-5", caseId: "VT-1042", date: "2026-08-18", time: "09:24", user: "System", action: "Potential match detected", detail: "3 potential visual matches queued for human review." },
  { id: "TL-6", caseId: "VT-1042", date: "2026-08-19", time: "13:40", user: "Coordinator", action: "Reviewer assigned", detail: "Dalia Moussa assigned to review queue." },
  { id: "TL-7", caseId: "VT-1042", date: "2026-08-20", time: "14:05", user: "Dalia Moussa", action: "Lead reviewed", detail: "Potential Match #02 saved as a lead for field verification." },
  { id: "TL-8", caseId: "VT-1039", date: "2026-08-17", time: "18:02", user: "Mariam Khaled", action: "Case created", detail: "Case VT-1039 opened under Metro Search Team." },
  { id: "TL-9", caseId: "VT-1039", date: "2026-08-18", time: "08:15", user: "Mariam Khaled", action: "Evidence added", detail: "Interview summary attached." },
  { id: "TL-10", caseId: "VT-1036", date: "2026-08-12", time: "14:00", user: "Omar Nabil", action: "Evidence flagged", detail: "EV-4835 flagged for quality review." },
];

export const matches: PotentialMatch[] = [
  { id: "PM-01", caseId: "VT-1042", rank: 1, similarity: 87, source: "Uploaded Evidence", location: "Alexandria — Corniche", timestamp: "2026-08-16 19:36", distanceKm: 0.8, status: "Awaiting Review", coordinates: { x: 41, y: 45 } },
  { id: "PM-02", caseId: "VT-1042", rank: 2, similarity: 74, source: "Authorized Venue Clip", location: "Alexandria — Raml Station", timestamp: "2026-08-17 08:12", distanceKm: 2.3, status: "Saved Lead", reviewer: "Dalia Moussa", coordinates: { x: 35, y: 48 } },
  { id: "PM-03", caseId: "VT-1042", rank: 3, similarity: 61, source: "Partner Organization Upload", location: "Alexandria — Sidi Gaber", timestamp: "2026-08-17 17:55", distanceKm: 3.6, status: "In Review", reviewer: "Ahmed Selim", coordinates: { x: 45, y: 38 } },
  { id: "PM-04", caseId: "VT-1042", rank: 4, similarity: 52, source: "Uploaded Evidence", location: "Alexandria — Stanley", timestamp: "2026-08-18 20:04", distanceKm: 5.1, status: "Dismissed", reviewer: "Ahmed Selim", coordinates: { x: 30, y: 36 } },
  { id: "PM-05", caseId: "VT-1039", rank: 1, similarity: 69, source: "Uploaded Evidence", location: "Cairo — Nasr City", timestamp: "2026-08-18 16:22", distanceKm: 1.4, status: "Awaiting Review", coordinates: { x: 60, y: 33 } },
  { id: "PM-06", caseId: "VT-1036", rank: 1, similarity: 58, source: "Station Still", location: "Alexandria — Sidi Gaber", timestamp: "2026-08-12 09:02", distanceKm: 0.3, status: "Dismissed", reviewer: "Omar Nabil", coordinates: { x: 46, y: 50 } },
];

export const alerts: AlertItem[] = [
  { id: "AL-201", category: "Cases", urgent: true, title: "New potential match requires review", detail: "Potential Match #01 (87% visual similarity) is queued on case VT-1042.", caseId: "VT-1042", at: "2026-08-20T14:12:00Z", read: false },
  { id: "AL-202", category: "Evidence", urgent: false, title: "New evidence added to Case VT-1042", detail: "Ahmed Selim uploaded an authorized venue clip (EV-4823).", caseId: "VT-1042", at: "2026-08-20T11:05:00Z", read: false },
  { id: "AL-203", category: "Team", urgent: false, title: "Search activity detected in assigned area", detail: "Coastal Response Unit logged field activity inside the VT-1042 search radius.", caseId: "VT-1042", at: "2026-08-19T19:31:00Z", read: true },
  { id: "AL-204", category: "Cases", urgent: true, title: "Case priority changed", detail: "VT-1039 priority raised from Medium to High by Mariam Khaled.", caseId: "VT-1039", at: "2026-08-19T09:02:00Z", read: true },
  { id: "AL-205", category: "Evidence", urgent: false, title: "Evidence flagged for quality review", detail: "EV-4835 flagged — low resolution, limited review value.", caseId: "VT-1036", at: "2026-08-18T14:20:00Z", read: true },
  { id: "AL-206", category: "Team", urgent: false, title: "Reviewer assignment updated", detail: "Dalia Moussa was assigned to the VT-1042 review queue.", caseId: "VT-1042", at: "2026-08-18T13:40:00Z", read: true },
];

export const team: TeamMember[] = [
  { id: "U-01", name: "Ahmed Selim", email: "a.selim@demo.visiontrack.app", role: "Investigator", status: "Active", assignedCases: 3, lastActive: "12 minutes ago" },
  { id: "U-02", name: "Dalia Moussa", email: "d.moussa@demo.visiontrack.app", role: "Reviewer", status: "Active", assignedCases: 2, lastActive: "1 hour ago" },
  { id: "U-03", name: "Mariam Khaled", email: "m.khaled@demo.visiontrack.app", role: "Coordinator", status: "Active", assignedCases: 2, lastActive: "3 hours ago" },
  { id: "U-04", name: "Omar Nabil", email: "o.nabil@demo.visiontrack.app", role: "Investigator", status: "Active", assignedCases: 2, lastActive: "Yesterday" },
  { id: "U-05", name: "Hana Roushdy", email: "h.roushdy@demo.visiontrack.app", role: "Administrator", status: "Active", assignedCases: 0, lastActive: "Just now" },
  { id: "U-06", name: "Kareem Adly", email: "k.adly@demo.visiontrack.app", role: "Viewer", status: "Invited", assignedCases: 0, lastActive: "—" },
  { id: "U-07", name: "Nour Sabry", email: "n.sabry@demo.visiontrack.app", role: "Reviewer", status: "Suspended", assignedCases: 0, lastActive: "3 weeks ago" },
];

export const auditLog: AuditEntry[] = [
  { id: "LOG-9001", timestamp: "2026-08-20 14:12", user: "Dalia Moussa", action: "Reviewed Potential Match #04", caseId: "VT-1042", object: "PM-04", metadata: "web · 10.4.2.19 · Alexandria office" },
  { id: "LOG-9002", timestamp: "2026-08-20 11:05", user: "Ahmed Selim", action: "Uploaded evidence", caseId: "VT-1042", object: "EV-4823", metadata: "web · 10.4.2.31" },
  { id: "LOG-9003", timestamp: "2026-08-19 09:02", user: "Mariam Khaled", action: "Updated case priority", caseId: "VT-1039", object: "priority: Medium → High", metadata: "web · 10.4.7.8" },
  { id: "LOG-9004", timestamp: "2026-08-19 08:55", user: "Hana Roushdy", action: "Granted reviewer role", object: "U-02", metadata: "admin console · 10.4.1.2" },
  { id: "LOG-9005", timestamp: "2026-08-18 09:20", user: "Ahmed Selim", action: "Created search job", caseId: "VT-1042", object: "SJ-2291", metadata: "web · 10.4.2.31" },
  { id: "LOG-9006", timestamp: "2026-08-18 14:20", user: "Omar Nabil", action: "Flagged evidence", caseId: "VT-1036", object: "EV-4835", metadata: "web · 10.4.9.14" },
  { id: "LOG-9007", timestamp: "2026-08-17 18:02", user: "Mariam Khaled", action: "Created case", caseId: "VT-1039", object: "VT-1039", metadata: "web · 10.4.7.8" },
  { id: "LOG-9008", timestamp: "2026-08-17 07:41", user: "Hana Roushdy", action: "Suspended account", object: "U-07", metadata: "admin console · 10.4.1.2" },
  { id: "LOG-9009", timestamp: "2026-08-16 10:20", user: "Ahmed Selim", action: "Uploaded evidence", caseId: "VT-1042", object: "EV-4822", metadata: "mobile · 10.4.2.31" },
  { id: "LOG-9010", timestamp: "2026-08-15 06:12", user: "Dalia Moussa", action: "Created case", caseId: "VT-1042", object: "VT-1042", metadata: "web · 10.4.2.19" },
];

export const searchJobs = [
  { id: "SJ-2291", caseId: "VT-1042", startedBy: "Ahmed Selim", startedAt: "2026-08-18 09:20", scope: "Authorized evidence · 4 km", candidates: 1284, results: 4, state: "Complete" },
  { id: "SJ-2288", caseId: "VT-1039", startedBy: "Mariam Khaled", startedAt: "2026-08-18 16:04", scope: "Authorized evidence · 6 km", candidates: 942, results: 1, state: "Complete" },
  { id: "SJ-2284", caseId: "VT-1036", startedBy: "Omar Nabil", startedAt: "2026-08-12 09:00", scope: "Case evidence only", candidates: 310, results: 1, state: "Complete" },
  { id: "SJ-2280", caseId: "VT-1022", startedBy: "Ahmed Selim", startedAt: "2026-08-02 09:30", scope: "Authorized evidence · 12 km", candidates: 1755, results: 0, state: "Complete" },
];

export const casesOverTime = [
  { month: "Mar", opened: 8, resolved: 4 },
  { month: "Apr", opened: 11, resolved: 6 },
  { month: "May", opened: 9, resolved: 7 },
  { month: "Jun", opened: 14, resolved: 8 },
  { month: "Jul", opened: 12, resolved: 10 },
  { month: "Aug", opened: 16, resolved: 9 },
];

export const searchActivity = [
  { day: "Mon", searches: 12, reviews: 20 },
  { day: "Tue", searches: 18, reviews: 26 },
  { day: "Wed", searches: 15, reviews: 22 },
  { day: "Thu", searches: 24, reviews: 31 },
  { day: "Fri", searches: 20, reviews: 28 },
  { day: "Sat", searches: 9, reviews: 12 },
  { day: "Sun", searches: 7, reviews: 10 },
];

export const evidenceUploads = [
  { week: "W31", images: 34, videos: 6, documents: 12 },
  { week: "W32", images: 41, videos: 9, documents: 15 },
  { week: "W33", images: 28, videos: 4, documents: 9 },
  { week: "W34", images: 52, videos: 11, documents: 18 },
];

export function getCase(id: string) {
  return cases.find((c) => c.id === id);
}

export function caseEvidence(id: string) {
  return evidence.filter((e) => e.caseId === id);
}

export function caseTimeline(id: string) {
  return timeline.filter((t) => t.caseId === id);
}

export function caseMatches(id: string) {
  return matches.filter((m) => m.caseId === id);
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function relativeFrom(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days > 1) return `${days} days ago`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours >= 1) return `${hours} h ago`;
  const mins = Math.max(1, Math.floor(diff / 60_000));
  return `${mins} min ago`;
}
