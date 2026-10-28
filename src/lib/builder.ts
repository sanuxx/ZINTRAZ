// The system builder (/system-builder): every module a client can drop onto their blueprint, the
// industry templates they can start from, and the blueprint shape that is saved, shared and sent to us.
//
// Each module lists the events it raises (`t`, usable as workflow triggers), the actions it can take
// (`a`, usable as workflow steps) and a sample widget (`w`) that the virtual system preview renders.
import {
  Banknote, Barcode, BedDouble, Bell, BellRing, BookOpen, Bot, Boxes, BrainCircuit, Briefcase, Building2, Calculator, Calendar,
  CalendarCheck, CalendarClock, CalendarDays, CalendarPlus, Cctv, ChartLine, ChartPie, ChefHat, ClipboardList,
  Clock, Coins, Cpu, CreditCard, DatabaseBackup, Factory, FileSpreadsheet, FileText, FlaskConical, FolderOpen, Gauge, Gift, GitBranch,
  Globe, GraduationCap, Handshake, History, Hotel, IdCard, KeyRound, Landmark, Languages, LayoutDashboard, LifeBuoy, Lightbulb, Lock,
  Mail, MapPin, Megaphone, MessageCircle, MessagesSquare, Navigation, Package, PackageCheck, PartyPopper, PenLine, Percent, PiggyBank,
  Pill, Plug, Printer, QrCode, Receipt, Repeat, Satellite, ScanText, School, ScrollText, ShieldCheck, ShoppingBag, ShoppingCart,
  Smartphone, Sparkles, SquareKanban, Stamp, Star, Stethoscope, Store, Tags, Thermometer, Ticket, Timer, TriangleAlert, Truck,
  UserCheck, UserPlus, Utensils, Wallet, Warehouse, Webhook, WifiOff, Workflow, Wrench,
  type LucideIcon,
} from "lucide-react";

export type Widget =
  | { k: "stat"; t: string; v: string; s: string }
  | { k: "list"; t: string; rows: [string, string][] }
  | { k: "meter"; t: string; rows: [string, number][] }
  | { k: "spark"; t: string; v: string; pts: number[] }
  | { k: "bars"; t: string; v: string; pts: number[] }
  | { k: "chat"; t: string; q: string; a: string };

export type CatId = "sales" | "customers" | "ops" | "finance" | "people" | "industry" | "ai" | "connect" | "platform";
export const CATEGORIES: { id: CatId; name: string; hue: string; desc: string }[] = [
  { id: "sales", name: "Sales & orders", hue: "#0b5cff", desc: "Selling, ordering and booking" },
  { id: "customers", name: "Customers", hue: "#db2777", desc: "Relationships, loyalty and support" },
  { id: "ops", name: "Operations", hue: "#ea580c", desc: "Stock, logistics and day-to-day work" },
  { id: "finance", name: "Finance", hue: "#16a34a", desc: "Money in, money out, the books" },
  { id: "people", name: "People", hue: "#7c3aed", desc: "Staff, shifts and HR" },
  { id: "industry", name: "Industry modules", hue: "#0891b2", desc: "Built for a specific sector" },
  { id: "ai", name: "Data & AI", hue: "#9333ea", desc: "Dashboards, insight and AI agents" },
  { id: "connect", name: "Integrations & devices", hue: "#475569", desc: "Hardware, gateways and other software" },
  { id: "platform", name: "Platform", hue: "#0f766e", desc: "Security, scale and access" },
];

export type Mod = { id: string; name: string; cat: CatId; Icon: LucideIcon; desc: string; t: string[]; a: string[]; w: Widget };

const up = [3, 5, 4, 7, 6, 9, 8, 12];
const wk = [52, 61, 48, 70, 88, 96, 74];

export const MODULES: Mod[] = [
  // Sales & orders
  { id: "pos", name: "Point of sale", cat: "sales", Icon: Store, desc: "Fast checkout at the counter, on any device.", t: ["Sale completed", "Refund issued"], a: ["Record a sale", "Print a receipt"], w: { k: "spark", t: "Sales today", v: "LKR 486k", pts: up } },
  { id: "store", name: "Online store", cat: "sales", Icon: ShoppingCart, desc: "Your catalogue, cart and checkout on the web.", t: ["Online order placed", "Cart abandoned"], a: ["Publish a product", "Apply a discount"], w: { k: "stat", t: "Online orders", v: "84", s: "Conversion 3.4%" } },
  { id: "orders", name: "Order management", cat: "sales", Icon: ShoppingBag, desc: "Every order from every channel in one queue.", t: ["New order received", "Order status changed"], a: ["Create an order", "Update order status", "Cancel an order"], w: { k: "list", t: "Open orders", rows: [["#5520 · 3 items", "packing"], ["#5521 · 1 item", "new"], ["#5522 · 6 items", "ready"]] } },
  { id: "quotes", name: "Quotations", cat: "sales", Icon: FileText, desc: "Branded quotes that turn into orders in one click.", t: ["Quote accepted", "Quote expired"], a: ["Send a quote", "Convert quote to order"], w: { k: "stat", t: "Quotes out", v: "17", s: "LKR 4.2m pipeline" } },
  { id: "subs", name: "Subscriptions", cat: "sales", Icon: Repeat, desc: "Recurring plans, renewals and billing cycles.", t: ["Subscription renewed", "Subscription cancelled"], a: ["Start a subscription", "Pause a subscription"], w: { k: "stat", t: "Active subscribers", v: "1,284", s: "MRR LKR 2.1m" } },
  { id: "bookings", name: "Bookings & reservations", cat: "sales", Icon: CalendarCheck, desc: "Online and walk-in bookings on one calendar.", t: ["Booking made", "Booking cancelled", "No-show"], a: ["Create a booking", "Reschedule a booking"], w: { k: "list", t: "Today's bookings", rows: [["09:30 · Silva", "confirmed"], ["11:00 · Perera", "new"], ["14:00 · Tanaka", "confirmed"]] } },
  { id: "tables", name: "Table management", cat: "sales", Icon: Utensils, desc: "Floor plan, covers and table turns.", t: ["Table seated", "Table freed"], a: ["Seat a party", "Merge tables"], w: { k: "stat", t: "Tables in use", v: "14 / 20", s: "Avg turn 52 min" } },
  { id: "tickets", name: "Ticketing & events", cat: "sales", Icon: Ticket, desc: "Sell tickets, scan entry, manage capacity.", t: ["Ticket sold", "Guest checked in"], a: ["Issue a ticket", "Scan a ticket"], w: { k: "meter", t: "Event capacity", rows: [["Gala dinner", 86], ["Workshop", 42], ["Concert", 97]] } },
  { id: "pricing", name: "Pricing & promotions", cat: "sales", Icon: Tags, desc: "Price lists, offers, coupons and happy hours.", t: ["Promotion started", "Coupon redeemed"], a: ["Create a promotion", "Change a price"], w: { k: "stat", t: "Coupons redeemed", v: "312", s: "This month" } },

  // Customers
  { id: "crm", name: "CRM", cat: "customers", Icon: Handshake, desc: "Leads, contacts, deals and follow-ups.", t: ["New lead", "Deal won", "Deal lost"], a: ["Create a lead", "Move a deal", "Schedule a follow-up"], w: { k: "bars", t: "Pipeline by stage", v: "LKR 12.8m", pts: [80, 64, 46, 30, 18] } },
  { id: "loyalty", name: "Loyalty & rewards", cat: "customers", Icon: Gift, desc: "Points, tiers and rewards that bring people back.", t: ["Points earned", "Reward redeemed"], a: ["Add points", "Issue a reward"], w: { k: "stat", t: "Loyalty members", v: "3,480", s: "+42 this week" } },
  { id: "custapp", name: "Customer app", cat: "customers", Icon: Smartphone, desc: "Your brand on their phone: order, book, pay.", t: ["App order placed", "App sign-up"], a: ["Send a push notification"], w: { k: "stat", t: "App orders", v: "64", s: "Rated 4.9" } },
  { id: "reviews", name: "Feedback & reviews", cat: "customers", Icon: Star, desc: "Collect ratings and act on the bad ones fast.", t: ["Review received", "Low rating received"], a: ["Request a review", "Reply to a review"], w: { k: "stat", t: "Average rating", v: "4.8 ★", s: "32 reviews this month" } },
  { id: "support", name: "Support tickets", cat: "customers", Icon: LifeBuoy, desc: "Every complaint and request tracked to done.", t: ["Ticket opened", "Ticket overdue"], a: ["Open a ticket", "Assign a ticket", "Close a ticket"], w: { k: "list", t: "Open tickets", rows: [["#412 · Late delivery", "high"], ["#413 · Refund", "new"], ["#414 · Login help", "waiting"]] } },
  { id: "marketing", name: "Marketing campaigns", cat: "customers", Icon: Megaphone, desc: "Segments, campaigns and results in one place.", t: ["Campaign sent", "Customer unsubscribed"], a: ["Send a campaign", "Add to a segment"], w: { k: "stat", t: "Campaign opens", v: "41%", s: "Last campaign · 6,200 sent" } },
  { id: "whatsapp", name: "WhatsApp channel", cat: "customers", Icon: MessageCircle, desc: "Talk to customers where they already are.", t: ["WhatsApp message received"], a: ["Send a WhatsApp message"], w: { k: "chat", t: "WhatsApp", q: "Is my order on the way?", a: "Yes — it arrives at 3:15 pm." } },
  { id: "livechat", name: "Live chat", cat: "customers", Icon: MessagesSquare, desc: "Chat on your website, handed to the right person.", t: ["Chat started"], a: ["Reply in chat", "Hand chat to staff"], w: { k: "stat", t: "Chats today", v: "58", s: "First reply 39 s" } },
  { id: "portal", name: "Customer portal", cat: "customers", Icon: Globe, desc: "Customers see orders, invoices and documents themselves.", t: ["Portal login", "Document downloaded"], a: ["Share a document", "Invite a customer"], w: { k: "stat", t: "Portal users", v: "912", s: "Self-served 71% of requests" } },

  // Operations
  { id: "inventory", name: "Inventory", cat: "ops", Icon: Package, desc: "Live stock levels, counts and transfers.", t: ["Stock below minimum", "Stock counted"], a: ["Adjust stock", "Transfer stock", "Reserve stock"], w: { k: "meter", t: "Stock levels", rows: [["Basmati rice", 78], ["Fresh milk", 18], ["Chicken", 52]] } },
  { id: "purchasing", name: "Purchasing & suppliers", cat: "ops", Icon: ClipboardList, desc: "Purchase orders, suppliers and deliveries in.", t: ["Goods received", "Purchase order approved"], a: ["Create a purchase order", "Email a supplier"], w: { k: "list", t: "Purchase orders", rows: [["PO-118 · Rice", "arriving"], ["PO-119 · Packaging", "sent"], ["PO-120 · Milk", "draft"]] } },
  { id: "warehouse", name: "Warehouse", cat: "ops", Icon: Warehouse, desc: "Bins, picking, packing and capacity.", t: ["Pick list ready", "Bay full"], a: ["Create a pick list", "Move to a bin"], w: { k: "meter", t: "Bay capacity", rows: [["Bay A", 72], ["Bay B", 91], ["Bay C", 34]] } },
  { id: "kds", name: "Kitchen display", cat: "ops", Icon: ChefHat, desc: "Orders straight to the kitchen screen, timed.", t: ["Dish ready", "Order running late"], a: ["Send to kitchen", "Bump an order"], w: { k: "list", t: "Kitchen queue", rows: [["T12 · Chicken kottu", "4 min"], ["T5 · Hoppers ×3", "2 min"], ["Takeaway · Fried rice", "new"]] } },
  { id: "production", name: "Production", cat: "ops", Icon: Factory, desc: "Recipes, batches and work orders on the floor.", t: ["Batch completed", "Machine stopped"], a: ["Start a work order", "Record output"], w: { k: "bars", t: "Units produced", v: "4,820", pts: wk } },
  { id: "quality", name: "Quality checks", cat: "ops", Icon: ShieldCheck, desc: "Checklists and inspections with photo proof.", t: ["Check failed", "Inspection due"], a: ["Run a checklist", "Log a defect"], w: { k: "meter", t: "Checks passed", rows: [["Kitchen hygiene", 98], ["Cold storage", 92], ["Packaging", 87]] } },
  { id: "maintenance", name: "Asset maintenance", cat: "ops", Icon: Wrench, desc: "Equipment register, service plans and repairs.", t: ["Repair requested", "Service due"], a: ["Raise a work order", "Schedule a service"], w: { k: "list", t: "Maintenance", rows: [["Freezer 2 · service", "Fri"], ["AC Room 311", "in progress"], ["Van 4 · tyres", "done"]] } },
  { id: "housekeeping", name: "Housekeeping", cat: "ops", Icon: Sparkles, desc: "Room and area cleaning, assigned and tracked.", t: ["Room cleaned", "Cleaning requested"], a: ["Assign cleaning", "Mark area ready"], w: { k: "meter", t: "Rooms ready", rows: [["Floor 1", 100], ["Floor 2", 75], ["Floor 3", 40]] } },
  { id: "dispatch", name: "Delivery & dispatch", cat: "ops", Icon: Truck, desc: "Routes, drivers and delivery slots.", t: ["Out for delivery", "Delivered"], a: ["Assign a driver", "Plan a route"], w: { k: "list", t: "Out for delivery", rows: [["#5520 · Kandy", "2:40 pm"], ["#5521 · Galle", "3:15 pm"], ["#5523 · Colombo 7", "4:00 pm"]] } },
  { id: "fleet", name: "Fleet tracking", cat: "ops", Icon: Navigation, desc: "Live vehicle locations, trips and fuel.", t: ["Vehicle off route", "Trip completed"], a: ["Locate a vehicle"], w: { k: "stat", t: "Vehicles on the road", v: "11", s: "All on schedule" } },
  { id: "fieldservice", name: "Field service", cat: "ops", Icon: MapPin, desc: "Jobs, technicians and on-site reports.", t: ["Job completed", "Technician arrived"], a: ["Book a job", "Send a technician"], w: { k: "stat", t: "Jobs today", v: "26", s: "92% first-time fix" } },
  { id: "tasks", name: "Projects & tasks", cat: "ops", Icon: SquareKanban, desc: "Boards, owners and deadlines for every job.", t: ["Task overdue", "Task completed"], a: ["Create a task", "Assign a task"], w: { k: "bars", t: "Tasks done this week", v: "148", pts: wk } },
  { id: "docs", name: "Document management", cat: "ops", Icon: FolderOpen, desc: "One searchable home for every file and version.", t: ["Document uploaded", "Document expiring"], a: ["File a document", "Request a signature"], w: { k: "stat", t: "Documents", v: "12.4k", s: "Found in < 2 s" } },
  { id: "approvals", name: "Approvals", cat: "ops", Icon: Stamp, desc: "Requests that route themselves to the right approver.", t: ["Approval requested", "Request approved", "Request rejected"], a: ["Request approval"], w: { k: "list", t: "Waiting for you", rows: [["PO 2291 · LKR 412k", "Finance"], ["Leave · R. Perera", "Manager"], ["Refund #771", "Owner"]] } },
  { id: "scheduling", name: "Resource scheduling", cat: "ops", Icon: CalendarClock, desc: "Rooms, equipment and vehicles booked without clashes.", t: ["Resource booked", "Clash detected"], a: ["Book a resource"], w: { k: "meter", t: "Utilisation", rows: [["Meeting rooms", 64], ["Vehicles", 81], ["Equipment", 47]] } },

  // Finance
  { id: "invoicing", name: "Invoicing", cat: "finance", Icon: Receipt, desc: "Invoices out on time, paid faster.", t: ["Invoice sent", "Invoice overdue", "Invoice paid"], a: ["Create an invoice", "Send a reminder"], w: { k: "spark", t: "Invoiced this month", v: "LKR 8.4m", pts: up } },
  { id: "payments", name: "Payments", cat: "finance", Icon: CreditCard, desc: "Cards, QR, bank transfer and cash reconciled.", t: ["Payment received", "Payment failed"], a: ["Take a payment", "Issue a refund"], w: { k: "spark", t: "Takings today", v: "LKR 1.2m", pts: up } },
  { id: "accounting", name: "Accounting", cat: "finance", Icon: Calculator, desc: "Ledgers, reconciliations and month-end.", t: ["Books closed", "Mismatch found"], a: ["Post a journal", "Reconcile accounts"], w: { k: "stat", t: "Books", v: "Balanced", s: "Synced 2 min ago" } },
  { id: "expenses", name: "Expenses", cat: "finance", Icon: Wallet, desc: "Receipts snapped, claims approved, paid back.", t: ["Expense submitted"], a: ["Submit an expense", "Reimburse an expense"], w: { k: "stat", t: "Claims pending", v: "9", s: "LKR 84k" } },
  { id: "payroll", name: "Payroll", cat: "finance", Icon: Banknote, desc: "Hours and shifts to payslips, automatically.", t: ["Payroll ready", "Payslips sent"], a: ["Run payroll", "Send payslips"], w: { k: "stat", t: "Payroll", v: "Ready", s: "26 staff · paid Friday" } },
  { id: "budgets", name: "Budgets & cash flow", cat: "finance", Icon: PiggyBank, desc: "Plan versus actual, and cash weeks ahead.", t: ["Budget exceeded"], a: ["Set a budget"], w: { k: "meter", t: "Budget used", rows: [["Marketing", 72], ["Payroll", 88], ["Supplies", 104]] } },
  { id: "tax", name: "Tax & VAT", cat: "finance", Icon: Percent, desc: "Tax calculated on every sale, returns ready.", t: ["Return due"], a: ["Prepare a tax return"], w: { k: "stat", t: "VAT this quarter", v: "LKR 1.9m", s: "Return due in 12 days" } },
  { id: "pettycash", name: "Cash management", cat: "finance", Icon: Coins, desc: "Tills, floats and cash-ups that balance.", t: ["Till closed", "Cash difference"], a: ["Cash up a till"], w: { k: "stat", t: "Tills", v: "4 / 4", s: "Balanced last night" } },

  // People
  { id: "hr", name: "HR records", cat: "people", Icon: IdCard, desc: "Every employee, contract and document.", t: ["Employee joined", "Contract expiring"], a: ["Add an employee", "Update a record"], w: { k: "stat", t: "Team", v: "48", s: "3 joining this month" } },
  { id: "attendance", name: "Time & attendance", cat: "people", Icon: Clock, desc: "Clock in by app, QR or device.", t: ["Staff clocked in", "Staff late"], a: ["Record attendance"], w: { k: "meter", t: "On time today", rows: [["Front of house", 96], ["Kitchen", 88], ["Delivery", 91]] } },
  { id: "leave", name: "Leave", cat: "people", Icon: Calendar, desc: "Requests, balances and cover planned together.", t: ["Leave requested", "Leave approved"], a: ["Request leave", "Approve leave"], w: { k: "list", t: "On leave", rows: [["R. Perera", "today"], ["S. Kumar", "Thu – Fri"], ["A. Silva", "next week"]] } },
  { id: "rostering", name: "Shift rostering", cat: "people", Icon: CalendarDays, desc: "Rosters built around demand and availability.", t: ["Shift swapped", "Shift unfilled"], a: ["Publish a roster", "Fill a shift"], w: { k: "stat", t: "Shifts this week", v: "212", s: "2 still open" } },
  { id: "recruit", name: "Recruitment", cat: "people", Icon: UserPlus, desc: "Job posts, applicants and interviews.", t: ["Application received"], a: ["Post a job", "Schedule an interview"], w: { k: "bars", t: "Applicants by stage", v: "64", pts: [64, 32, 14, 6, 2] } },
  { id: "training", name: "Training", cat: "people", Icon: GraduationCap, desc: "Courses, certificates and onboarding paths.", t: ["Course completed", "Certificate expiring"], a: ["Assign a course"], w: { k: "meter", t: "Training complete", rows: [["Food safety", 94], ["Fire safety", 81], ["Customer care", 67]] } },
  { id: "performance", name: "Performance", cat: "people", Icon: Gauge, desc: "Goals, reviews and feedback through the year.", t: ["Review due"], a: ["Start a review", "Set a goal"], w: { k: "stat", t: "Reviews done", v: "38 / 48", s: "Cycle closes Friday" } },

  // Industry modules
  { id: "emr", name: "Patient records", cat: "industry", Icon: Stethoscope, desc: "Visits, notes, prescriptions and history.", t: ["Patient registered", "Consultation saved"], a: ["Open a patient record", "Write a prescription"], w: { k: "stat", t: "Patients seen", v: "23", s: "Notes saved to every record" } },
  { id: "appointments", name: "Appointments", cat: "industry", Icon: CalendarPlus, desc: "Doctors' diaries, queues and reminders.", t: ["Appointment booked", "Patient checked in"], a: ["Book an appointment", "Call the next patient"], w: { k: "list", t: "Today's appointments", rows: [["09:30 · Ms. Silva", "Dr. Fernando"], ["10:00 · Mr. Jayasinghe", "Dr. Perera"], ["10:30 · Baby Nethmi", "Dr. Fernando"]] } },
  { id: "pharmacy", name: "Pharmacy", cat: "industry", Icon: Pill, desc: "Dispensing, batches and expiry dates.", t: ["Prescription received", "Batch expiring"], a: ["Dispense medicine"], w: { k: "meter", t: "Pharmacy stock", rows: [["Paracetamol", 82], ["Amoxicillin", 24], ["Insulin", 61]] } },
  { id: "lab", name: "Lab results", cat: "industry", Icon: FlaskConical, desc: "Tests ordered, results back to the record.", t: ["Result ready"], a: ["Order a test", "Share a result"], w: { k: "stat", t: "Results today", v: "41", s: "12 sent to patients" } },
  { id: "sis", name: "Student records", cat: "industry", Icon: School, desc: "Enrolment, classes and every student's file.", t: ["Student enrolled"], a: ["Enrol a student"], w: { k: "stat", t: "Students", v: "1,240", s: "18 new applications" } },
  { id: "timetable", name: "Timetable", cat: "industry", Icon: BookOpen, desc: "Classes, rooms and teachers without clashes.", t: ["Timetable changed"], a: ["Publish a timetable", "Find a substitute"], w: { k: "list", t: "In class now", rows: [["6B · Mathematics", "Room 12"], ["8A · Science", "Lab 2"], ["10C · English", "Room 4"]] } },
  { id: "exams", name: "Exams & grades", cat: "industry", Icon: PenLine, desc: "Marks, report cards and progress.", t: ["Report card published"], a: ["Enter marks", "Publish report cards"], w: { k: "bars", t: "Term average", v: "74%", pts: [62, 70, 68, 74, 79, 71, 76] } },
  { id: "fees", name: "School fees", cat: "industry", Icon: Landmark, desc: "Fee plans, payments and reminders.", t: ["Fee overdue", "Fee paid"], a: ["Issue a fee invoice"], w: { k: "meter", t: "Fees collected", rows: [["Term 1", 96], ["Term 2", 82], ["Term 3", 12]] } },
  { id: "pms", name: "Property management (PMS)", cat: "industry", Icon: Hotel, desc: "Rooms, rates, check-in and the guest folio.", t: ["Guest checked in", "Guest checked out"], a: ["Check a guest in", "Post to a folio"], w: { k: "stat", t: "Occupancy tonight", v: "86%", s: "All channels in sync" } },
  { id: "channels", name: "Channel manager", cat: "industry", Icon: BedDouble, desc: "Rates and availability synced to every booking site.", t: ["Channel booking received"], a: ["Update rates", "Close a room type"], w: { k: "list", t: "Channels", rows: [["Website", "in sync"], ["Travel agents", "in sync"], ["Walk-in", "live"]] } },
  { id: "events", name: "Events & banquets", cat: "industry", Icon: PartyPopper, desc: "Function rooms, menus and event sheets.", t: ["Event confirmed"], a: ["Hold a function room", "Send an event sheet"], w: { k: "list", t: "Upcoming events", rows: [["Wedding · 220 pax", "Sat"], ["Conference · 80 pax", "Tue"], ["Birthday · 40 pax", "Sun"]] } },
  { id: "menu", name: "Menu & recipes", cat: "industry", Icon: Utensils, desc: "Menus, recipes and the true cost of every dish.", t: ["Dish sold out"], a: ["Update the menu", "Cost a recipe"], w: { k: "meter", t: "Dish margin", rows: [["Chicken kottu", 68], ["Hoppers", 74], ["Fried rice", 61]] } },
  { id: "listings", name: "Property listings", cat: "industry", Icon: Building2, desc: "Listings, viewings and offers for real estate.", t: ["Viewing booked", "Offer received"], a: ["Publish a listing", "Book a viewing"], w: { k: "stat", t: "Active listings", v: "64", s: "11 viewings this week" } },
  { id: "pod", name: "Proof of delivery", cat: "industry", Icon: PackageCheck, desc: "Signature and photo captured at the door.", t: ["Delivery signed"], a: ["Capture a signature"], w: { k: "list", t: "Delivered", rows: [["L-2280 · signed", "R. Perera"], ["L-2283 · photo", "Gate 3"], ["L-2286 · signed", "S. Kumar"]] } },
  { id: "membership", name: "Memberships", cat: "industry", Icon: KeyRound, desc: "Members, plans and access for gyms and clubs.", t: ["Member checked in", "Membership expiring"], a: ["Renew a membership"], w: { k: "stat", t: "Members", v: "860", s: "Visits today 212" } },
  { id: "matters", name: "Client matters", cat: "industry", Icon: Briefcase, desc: "Cases, time and billing for professional services.", t: ["Matter opened", "Deadline near"], a: ["Log time", "Bill a matter"], w: { k: "stat", t: "Billable hours", v: "412", s: "This month" } },

  // Data & AI
  { id: "dashboard", name: "Live dashboard", cat: "ai", Icon: LayoutDashboard, desc: "The numbers that matter, live, on any screen.", t: ["Target reached"], a: ["Show on the dashboard"], w: { k: "spark", t: "Live now", v: "LKR 92k", pts: [4, 6, 5, 8, 7, 10, 9, 13] } },
  { id: "reports", name: "Reports", cat: "ai", Icon: FileSpreadsheet, desc: "Scheduled reports that build themselves.", t: ["Report ready"], a: ["Generate a report", "Email a report"], w: { k: "stat", t: "Reports this month", v: "24", s: "All automatic" } },
  { id: "bi", name: "Business intelligence", cat: "ai", Icon: ChartPie, desc: "Explore trends across every module.", t: [], a: ["Update the analysis"], w: { k: "bars", t: "Revenue by branch", v: "LKR 24m", pts: [88, 64, 52, 40] } },
  { id: "forecast", name: "Forecasting", cat: "ai", Icon: ChartLine, desc: "Demand, stock and cash predicted ahead.", t: ["Forecast updated", "Demand spike predicted"], a: ["Forecast demand"], w: { k: "spark", t: "Forecast · next 4 weeks", v: "+18%", pts: [5, 6, 6, 7, 8, 9, 11, 12] } },
  { id: "agent", name: "AI agent", cat: "ai", Icon: Bot, desc: "Answers and acts 24/7 on WhatsApp and web.", t: ["Agent needs a human"], a: ["Ask the AI agent to handle it", "Let the AI agent reply"], w: { k: "chat", t: "AI agent · WhatsApp", q: "Can I come in at 8 tonight?", a: "You're booked for 8 pm — see you then." } },
  { id: "docai", name: "Document AI", cat: "ai", Icon: ScanText, desc: "Reads invoices, forms and IDs into your system.", t: ["Document read"], a: ["Extract data from a document"], w: { k: "stat", t: "Documents read", v: "1,904", s: "98.6% accuracy" } },
  { id: "analyst", name: "AI analyst", cat: "ai", Icon: BrainCircuit, desc: "Ask questions of your data in plain language.", t: [], a: ["Ask the AI analyst"], w: { k: "chat", t: "AI analyst", q: "Why were sales down on Tuesday?", a: "Rain: walk-ins fell 31%, online rose 12%." } },
  { id: "recommend", name: "Recommendations", cat: "ai", Icon: Lightbulb, desc: "Next best product, offer or action for each customer.", t: [], a: ["Recommend an offer"], w: { k: "stat", t: "Upsell rate", v: "14%", s: "+3 pts since launch" } },
  { id: "alerts", name: "Anomaly alerts", cat: "ai", Icon: TriangleAlert, desc: "Spots the unusual before it costs you.", t: ["Anomaly detected"], a: ["Raise an alert"], w: { k: "list", t: "Alerts", rows: [["Refunds up 3× · Branch 2", "check"], ["Cold room 2 · 8°C", "fixed"], ["Unusual login", "blocked"]] } },

  // Integrations & devices
  { id: "gateway", name: "Payment gateway", cat: "connect", Icon: Wallet, desc: "Cards and wallets online and in store.", t: ["Card payment received"], a: ["Charge a card"], w: { k: "stat", t: "Card payments", v: "1,120", s: "Success rate 99.2%" } },
  { id: "messaging", name: "SMS & email gateway", cat: "connect", Icon: Mail, desc: "Transactional SMS and email at scale.", t: [], a: ["Send an SMS", "Send an email"], w: { k: "stat", t: "Messages sent", v: "18.2k", s: "This month" } },
  { id: "acctsoftware", name: "Accounting software link", cat: "connect", Icon: Plug, desc: "Two-way sync with the accounting tool you use.", t: ["Sync finished"], a: ["Sync to accounting"], w: { k: "stat", t: "Last sync", v: "2 min ago", s: "0 errors" } },
  { id: "office", name: "Email & calendar suite", cat: "connect", Icon: CalendarCheck, desc: "Works with your Google or Microsoft workspace.", t: ["Calendar event created"], a: ["Add a calendar event"], w: { k: "stat", t: "Connected accounts", v: "26", s: "Calendars in sync" } },
  { id: "scanners", name: "Barcode & QR scanning", cat: "connect", Icon: Barcode, desc: "Scan to sell, receive, count and track.", t: ["Item scanned"], a: ["Look up a barcode"], w: { k: "stat", t: "Scans today", v: "3,412", s: "6 devices" } },
  { id: "printers", name: "Receipt & label printers", cat: "connect", Icon: Printer, desc: "Receipts, kitchen tickets and labels.", t: [], a: ["Print a label", "Print a kitchen ticket"], w: { k: "stat", t: "Printers online", v: "5 / 5", s: "Paper OK" } },
  { id: "sensors", name: "IoT sensors", cat: "connect", Icon: Thermometer, desc: "Temperature, doors, power and more, live.", t: ["Sensor out of range"], a: ["Read a sensor"], w: { k: "meter", t: "Cold rooms", rows: [["Cold room 1 · 3°C", 30], ["Cold room 2 · 6°C", 60], ["Freezer · −18°C", 20]] } },
  { id: "cctv", name: "Camera analytics", cat: "connect", Icon: Cctv, desc: "Footfall, queues and occupancy from cameras.", t: ["Queue too long"], a: ["Count footfall"], w: { k: "bars", t: "Footfall today", v: "1,284", pts: [20, 46, 80, 64, 92, 70, 38] } },
  { id: "biometric", name: "Biometric devices", cat: "connect", Icon: UserCheck, desc: "Fingerprint and face clock-in terminals.", t: ["Face recognised"], a: ["Enrol a staff member"], w: { k: "stat", t: "Clock-ins today", v: "44", s: "3 terminals" } },
  { id: "gps", name: "GPS trackers", cat: "connect", Icon: Satellite, desc: "Location from vehicles and equipment.", t: ["Geofence entered"], a: ["Ping a tracker"], w: { k: "stat", t: "Trackers live", v: "14", s: "Updated every 30 s" } },
  { id: "qrmenu", name: "QR ordering", cat: "connect", Icon: QrCode, desc: "Scan at the table, order and pay from the phone.", t: ["QR order placed"], a: ["Generate a QR code"], w: { k: "stat", t: "QR orders", v: "212", s: "38% of dine-in" } },
  { id: "api", name: "Open API & webhooks", cat: "connect", Icon: Webhook, desc: "Connect anything else you already run.", t: ["Webhook received"], a: ["Call a webhook"], w: { k: "stat", t: "API calls", v: "84k", s: "Today · 99.99% up" } },
  { id: "esign", name: "E-signatures", cat: "connect", Icon: ScrollText, desc: "Contracts and forms signed online.", t: ["Document signed"], a: ["Send for signature"], w: { k: "stat", t: "Signed this month", v: "57", s: "Avg 4 h to sign" } },

  // Platform
  { id: "multibranch", name: "Multi-branch", cat: "platform", Icon: Building2, desc: "Every location in one system, one view.", t: [], a: ["Compare branches"], w: { k: "list", t: "Branches", rows: [["Colombo 3", "live"], ["Kandy", "live"], ["Galle", "opening"]] } },
  { id: "roles", name: "Roles & permissions", cat: "platform", Icon: Lock, desc: "Everyone sees and does exactly what they should.", t: [], a: ["Grant access"], w: { k: "stat", t: "Roles", v: "9", s: "Least-privilege by default" } },
  { id: "audit", name: "Audit trail", cat: "platform", Icon: History, desc: "Who did what, when, on every record.", t: [], a: ["Log an action"], w: { k: "stat", t: "Actions logged", v: "182k", s: "Kept 7 years" } },
  { id: "backups", name: "Backups & recovery", cat: "platform", Icon: DatabaseBackup, desc: "Automatic backups and fast restores.", t: ["Backup finished"], a: ["Take a backup"], w: { k: "stat", t: "Last backup", v: "02:00", s: "Restore tested monthly" } },
  { id: "staffapp", name: "Staff mobile app", cat: "platform", Icon: Smartphone, desc: "Tasks, approvals and alerts in the team's pocket.", t: ["Staff alert acknowledged"], a: ["Notify staff in the app"], w: { k: "stat", t: "Staff app users", v: "41", s: "Daily active 92%" } },
  { id: "offline", name: "Offline mode", cat: "platform", Icon: WifiOff, desc: "Keep selling when the internet drops.", t: ["Back online"], a: ["Queue for sync"], w: { k: "stat", t: "Offline sales synced", v: "36", s: "Last outage 4 min" } },
  { id: "multilang", name: "Multi-language", cat: "platform", Icon: Languages, desc: "English, Sinhala, Tamil and more.", t: [], a: ["Translate content"], w: { k: "stat", t: "Languages", v: "3", s: "EN · SI · TA" } },
  { id: "multicurrency", name: "Multi-currency", cat: "platform", Icon: Coins, desc: "Prices and payments in any currency.", t: [], a: ["Convert currency"], w: { k: "stat", t: "Currencies", v: "4", s: "LKR · USD · EUR · GBP" } },
  { id: "automation", name: "Workflow engine", cat: "platform", Icon: Workflow, desc: "Runs the workflows you design, with logs.", t: ["Workflow failed"], a: ["Start a workflow"], w: { k: "stat", t: "Workflow runs", v: "2,914", s: "This week · 0 failed" } },
  { id: "notifications", name: "Notification centre", cat: "platform", Icon: Bell, desc: "One place for every alert, by role.", t: [], a: ["Notify a role"], w: { k: "stat", t: "Alerts today", v: "38", s: "All acknowledged" } },
  { id: "ai-core", name: "Hosted on ZINTRAZ core", cat: "platform", Icon: Cpu, desc: "Shared, secure core that every module runs on.", t: [], a: [], w: { k: "stat", t: "Uptime", v: "99.95%", s: "Last 90 days" } },
];

export const MOD = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<string, Mod>;
export const catOf = (id: CatId) => CATEGORIES.find((c) => c.id === id)!;

// ── Workflows ──
export type StepKind = "action" | "notify" | "condition" | "approval" | "wait" | "ai";
export type Step = { id: string; kind: StepKind; mod?: string; text: string };
export type Flow = { id: string; name: string; trigger: { mod: string; event: string }; steps: Step[] };

export const STEP_KINDS: { kind: StepKind; name: string; Icon: LucideIcon; hint: string }[] = [
  { kind: "action", name: "Do something", Icon: Workflow, hint: "An action in one of your modules" },
  { kind: "notify", name: "Notify", Icon: BellRing, hint: "Tell a person or a customer" },
  { kind: "condition", name: "Check a condition", Icon: GitBranch, hint: "Only continue if…" },
  { kind: "approval", name: "Ask for approval", Icon: Stamp, hint: "Wait for someone to approve" },
  { kind: "wait", name: "Wait", Icon: Timer, hint: "Pause before the next step" },
  { kind: "ai", name: "Let AI handle it", Icon: Bot, hint: "An AI agent decides or replies" },
];
export const SYSTEM_TRIGGERS = ["Every day at 8:00", "Every Monday morning", "At the end of each month", "A form is submitted", "Started by a person"];
export const NOTIFY = ["the manager", "the owner", "the customer", "the team on duty", "the kitchen", "the driver", "finance", "the supplier"];
export const CHANNELS = ["WhatsApp", "SMS", "email", "the staff app", "a push notification"];
export const WAITS = ["5 minutes", "1 hour", "1 day", "3 days", "1 week"];
export const APPROVERS = ["the manager", "the owner", "finance", "the department head"];
export const CONDITIONS = ["the amount is over LKR 100,000", "it is a VIP customer", "stock is below minimum", "it is outside working hours", "it is the first order", "the rating is 3 stars or less"];

// ── Blueprint ──
export type Prio = "must" | "nice";
export type Node = { id: string; mod: string; x: number; y: number; label?: string; prio: Prio; note?: string };
export type Link = { id: string; from: string; to: string };
export type Business = { name: string; industry: string; size: string; branches: string; users: string; timeline: string; budget: string; notes: string };
export type Contact = { name: string; email: string; phone: string; company: string };
export type Blueprint = { v: 1; template: string; business: Business; nodes: Node[]; links: Link[]; flows: Flow[]; accent: string; contact: Contact };

export const SIZES = ["Just me", "2–10 people", "11–50 people", "51–200 people", "200+ people"];
export const TIMELINES = ["As soon as possible", "Within 3 months", "3–6 months", "Just exploring"];
export const BUDGETS = ["Not decided yet", "Under LKR 1m", "LKR 1–3m", "LKR 3–10m", "Over LKR 10m"];
export const ACCENTS = ["#0b5cff", "#7c3aed", "#0891b2", "#16a34a", "#ea580c", "#db2777", "#0f172a"];

export const uid = () => Math.random().toString(36).slice(2, 9);

const emptyBusiness = (name = "", industry = ""): Business => ({ name, industry, size: "", branches: "1", users: "", timeline: "", budget: "", notes: "" });
export const emptyContact = (): Contact => ({ name: "", email: "", phone: "", company: "" });

// ── Templates ──
type FlowSeed = [string, [string, string], [StepKind, string?, string?][]];
type Template = { id: string; name: string; industry: string; brand: string; Icon: LucideIcon; blurb: string; mods: string[]; links: [string, string][]; flows: FlowSeed[] };

export const TEMPLATES: Template[] = [
  { id: "restaurant", name: "Restaurant / café", industry: "Hospitality", brand: "Lotus Kitchen", Icon: ChefHat, blurb: "Orders, kitchen, tables, stock and takings.",
    mods: ["pos", "qrmenu", "tables", "kds", "menu", "inventory", "purchasing", "payments", "loyalty", "dashboard"],
    links: [["qrmenu", "pos"], ["pos", "kds"], ["tables", "pos"], ["kds", "inventory"], ["menu", "inventory"], ["inventory", "purchasing"], ["pos", "payments"], ["payments", "loyalty"], ["payments", "dashboard"]],
    flows: [
      ["Reorder before we run out", ["inventory", "Stock below minimum"], [["action", "purchasing", "Create a purchase order"], ["approval", undefined, "the manager"], ["action", "purchasing", "Email a supplier"]]],
      ["Thank regulars", ["payments", "Payment received"], [["condition", undefined, "it is a VIP customer"], ["action", "loyalty", "Add points"], ["notify", undefined, "the customer|WhatsApp"]]],
    ] },
  { id: "clinic", name: "Clinic / medical centre", industry: "Healthcare", brand: "CityCare Clinic", Icon: Stethoscope, blurb: "Appointments, records, pharmacy and billing.",
    mods: ["appointments", "emr", "lab", "pharmacy", "invoicing", "payments", "whatsapp", "agent", "dashboard"],
    links: [["agent", "appointments"], ["appointments", "emr"], ["emr", "lab"], ["emr", "pharmacy"], ["emr", "invoicing"], ["invoicing", "payments"], ["whatsapp", "agent"], ["payments", "dashboard"]],
    flows: [
      ["Cut no-shows", ["appointments", "Appointment booked"], [["wait", undefined, "1 day"], ["notify", undefined, "the customer|WhatsApp"], ["ai", "agent", "Let the AI agent reply"]]],
      ["Results to patients", ["lab", "Result ready"], [["approval", undefined, "the department head"], ["action", "lab", "Share a result"]]],
    ] },
  { id: "school", name: "School / academy", industry: "Education", brand: "Hillside College", Icon: GraduationCap, blurb: "Students, classes, attendance, exams and fees.",
    mods: ["sis", "timetable", "attendance", "exams", "fees", "payments", "portal", "messaging", "dashboard"],
    links: [["sis", "timetable"], ["sis", "attendance"], ["sis", "exams"], ["sis", "fees"], ["fees", "payments"], ["exams", "portal"], ["attendance", "messaging"], ["payments", "dashboard"]],
    flows: [
      ["Report cards to parents", ["exams", "Report card published"], [["action", "portal", "Share a document"], ["notify", undefined, "the customer|SMS"]]],
      ["Chase overdue fees", ["fees", "Fee overdue"], [["notify", undefined, "the customer|WhatsApp"], ["wait", undefined, "1 week"], ["notify", undefined, "finance|email"]]],
    ] },
  { id: "retail", name: "Shop / e-commerce", industry: "Retail & E-Commerce", brand: "Urban Sole", Icon: ShoppingBag, blurb: "Store and online, one stock, one customer view.",
    mods: ["pos", "store", "orders", "pricing", "inventory", "warehouse", "purchasing", "dispatch", "payments", "crm", "loyalty", "marketing", "dashboard"],
    links: [["store", "orders"], ["pos", "orders"], ["orders", "inventory"], ["orders", "dispatch"], ["inventory", "purchasing"], ["orders", "payments"], ["payments", "crm"], ["crm", "loyalty"], ["crm", "marketing"], ["payments", "dashboard"]],
    flows: [
      ["Win back abandoned carts", ["store", "Cart abandoned"], [["wait", undefined, "1 hour"], ["action", "pricing", "Apply a discount"], ["notify", undefined, "the customer|email"]]],
      ["Ship the same day", ["orders", "New order received"], [["action", "warehouse", "Create a pick list"], ["action", "dispatch", "Assign a driver"], ["notify", undefined, "the customer|SMS"]]],
    ] },
  { id: "hotel", name: "Hotel / resort", industry: "Hospitality", brand: "Palm Bay Hotel", Icon: Hotel, blurb: "Rooms, channels, housekeeping, events and folio.",
    mods: ["pms", "channels", "bookings", "housekeeping", "maintenance", "events", "pos", "payments", "reviews", "support", "agent", "dashboard"],
    links: [["channels", "pms"], ["bookings", "pms"], ["pms", "housekeeping"], ["housekeeping", "maintenance"], ["events", "pms"], ["pos", "pms"], ["pms", "payments"], ["payments", "reviews"], ["agent", "bookings"], ["payments", "dashboard"]],
    flows: [
      ["Room ready, guest told", ["housekeeping", "Room cleaned"], [["action", "pms", "Check a guest in"], ["notify", undefined, "the customer|WhatsApp"]]],
      ["Catch unhappy guests", ["reviews", "Low rating received"], [["notify", undefined, "the manager|the staff app"], ["action", "support", "Open a ticket"]]],
    ] },
  { id: "logistics", name: "Logistics / delivery", industry: "Logistics", brand: "Lanka Freight", Icon: Truck, blurb: "Jobs, warehouse, dispatch, tracking and POD.",
    mods: ["orders", "warehouse", "dispatch", "fleet", "gps", "pod", "invoicing", "portal", "dashboard"],
    links: [["orders", "warehouse"], ["warehouse", "dispatch"], ["dispatch", "fleet"], ["gps", "fleet"], ["fleet", "pod"], ["pod", "invoicing"], ["portal", "orders"], ["invoicing", "dashboard"]],
    flows: [
      ["Invoice on delivery", ["pod", "Delivery signed"], [["action", "invoicing", "Create an invoice"], ["notify", undefined, "the customer|email"]]],
      ["Off-route alert", ["fleet", "Vehicle off route"], [["notify", undefined, "the manager|the staff app"]]],
    ] },
  { id: "corporate", name: "Office / professional services", industry: "Corporate & Professional Services", brand: "Meridian Partners", Icon: Briefcase, blurb: "Clients, matters, documents, approvals and billing.",
    mods: ["crm", "matters", "tasks", "docs", "esign", "approvals", "invoicing", "hr", "leave", "reports"],
    links: [["crm", "matters"], ["matters", "tasks"], ["matters", "docs"], ["docs", "esign"], ["matters", "invoicing"], ["approvals", "invoicing"], ["hr", "leave"], ["invoicing", "reports"]],
    flows: [
      ["Big spend needs sign-off", ["approvals", "Approval requested"], [["condition", undefined, "the amount is over LKR 100,000"], ["approval", undefined, "finance"], ["notify", undefined, "the team on duty|email"]]],
      ["Month-end report", ["system", "At the end of each month"], [["action", "reports", "Generate a report"], ["action", "reports", "Email a report"]]],
    ] },
  { id: "blank", name: "Start from scratch", industry: "", brand: "", Icon: Boxes, blurb: "An empty canvas. Add only what you need.", mods: [], links: [], flows: [] },
];

/** Lays template modules out in category columns. */
export function layout(ids: string[]): Node[] {
  const cols = CATEGORIES.map((c) => ids.filter((id) => MOD[id]?.cat === c.id)).filter((c) => c.length);
  return cols.flatMap((col, ci) => col.map((id, ri) => ({ id: uid(), mod: id, x: 40 + ci * 250, y: 40 + ri * 120 + (ci % 2) * 50, prio: "must" as Prio })));
}

export function fromTemplate(t: Template): Blueprint {
  const nodes = layout(t.mods);
  const byMod = (m: string) => nodes.find((n) => n.mod === m)?.id;
  const links = t.links.flatMap(([a, b]) => { const f = byMod(a), to = byMod(b); return f && to ? [{ id: uid(), from: f, to }] : []; });
  const flows: Flow[] = t.flows.map(([name, [mod, event], steps]) => ({
    id: uid(), name, trigger: { mod, event },
    steps: steps.map(([kind, m, text]) => ({ id: uid(), kind, mod: m, text: text ?? "" })),
  }));
  return { v: 1, template: t.id, business: emptyBusiness(t.brand, t.industry), nodes, links, flows, accent: "#0b5cff", contact: emptyContact() };
}

export const blankBlueprint = (): Blueprint => fromTemplate(TEMPLATES.find((t) => t.id === "blank")!);

/** A plain-text description of a step, for the summary and the email. */
export function stepText(s: Step): string {
  const mod = s.mod ? MOD[s.mod]?.name : undefined;
  switch (s.kind) {
    case "action": return `${s.text || "Do something"}${mod ? ` (${mod})` : ""}`;
    case "notify": { const [who, via] = (s.text || "the manager|WhatsApp").split("|"); return `Notify ${who} by ${via}`; }
    case "condition": return `Only if ${s.text || "a condition is met"}`;
    case "approval": return `Ask ${s.text || "the manager"} to approve`;
    case "wait": return `Wait ${s.text || "1 day"}`;
    case "ai": return `${s.text || "Let the AI agent handle it"}${mod ? ` (${mod})` : ""}`;
  }
}

export const triggerText = (f: Flow) => (f.trigger.mod === "system" ? f.trigger.event : `${f.trigger.event} (${MOD[f.trigger.mod]?.name ?? f.trigger.mod})`);

/** The blueprint as a plain-text brief, for email, WhatsApp and the review copy. */
export function brief(bp: Blueprint, link?: string): string {
  const b = bp.business, nodeName = (id: string) => { const n = bp.nodes.find((x) => x.id === id); return n ? n.label || MOD[n.mod]?.name : "?"; };
  const lines: string[] = [];
  lines.push(`SYSTEM BLUEPRINT — ${b.name || "Untitled business"}`);
  lines.push([b.industry, b.size, b.branches && `${b.branches} branch(es)`, b.users && `${b.users} users`].filter(Boolean).join(" · "));
  if (b.timeline || b.budget) lines.push(`Timeline: ${b.timeline || "—"} · Budget: ${b.budget || "—"}`);
  lines.push("");
  lines.push(`MODULES (${bp.nodes.length})`);
  for (const c of CATEGORIES) {
    const ns = bp.nodes.filter((n) => MOD[n.mod]?.cat === c.id);
    if (ns.length) lines.push(`${c.name}: ${ns.map((n) => `${n.label || MOD[n.mod].name}${n.prio === "nice" ? " (nice to have)" : ""}${n.note ? ` [${n.note}]` : ""}`).join(", ")}`);
  }
  if (bp.links.length) { lines.push(""); lines.push(`CONNECTIONS (${bp.links.length})`); bp.links.forEach((l) => lines.push(`${nodeName(l.from)} → ${nodeName(l.to)}`)); }
  if (bp.flows.length) {
    lines.push(""); lines.push(`WORKFLOWS (${bp.flows.length})`);
    bp.flows.forEach((f, i) => { lines.push(`${i + 1}. ${f.name} — when: ${triggerText(f)}`); f.steps.forEach((s, k) => lines.push(`   ${k + 1}) ${stepText(s)}`)); });
  }
  if (b.notes) { lines.push(""); lines.push(`NOTES: ${b.notes}`); }
  const c = bp.contact;
  lines.push(""); lines.push(`FROM: ${[c.name, c.company, c.email, c.phone].filter(Boolean).join(" · ")}`);
  if (link) { lines.push(""); lines.push(`Open this blueprint: ${link}`); }
  return lines.join("\n");
}

// Share links carry the whole blueprint in the URL hash (base64url of compact JSON), so the team opens exactly what was built.
export function encode(bp: Blueprint): string {
  const json = JSON.stringify(bp);
  const bytes = new TextEncoder().encode(json);
  let bin = ""; bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function decode(s: string): Blueprint | null {
  try {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
    const json = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
    return validate(JSON.parse(json));
  } catch { return null; }
}
export function validate(x: unknown): Blueprint | null {
  const b = x as Blueprint;
  if (!b || b.v !== 1 || !Array.isArray(b.nodes) || !Array.isArray(b.links) || !Array.isArray(b.flows)) return null;
  return { ...blankBlueprint(), ...b, business: { ...emptyBusiness(), ...b.business }, contact: { ...emptyContact(), ...b.contact }, nodes: b.nodes.filter((n) => MOD[n.mod]) };
}
