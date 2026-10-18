import { BedDouble, Briefcase, ShoppingBag, Stethoscope, UtensilsCrossed, type LucideIcon } from "lucide-react";

/**
 * Content for the DelegateBoard demo on /ai. The visitor picks a business type and gets that
 * business's week of busywork. Each delegable task spawns an agent that works through `steps` while
 * its `out` (the email, chat, sheet… it is producing) fills in on the agent's screen. A step can be a
 * hiccup (`tone: "warn"`) followed by how the agent recovered (`tone: "fix"`). A task with `approval`
 * pauses at `at` (0–1 of its run) until the visitor answers. A `human` task is handed back instead.
 * `customTask` turns a note the visitor writes into a task by matching keywords to an agent template.
 */
export type Color = "yellow" | "pink" | "blue" | "green" | "orange" | "purple";
export type StepItem = string | { text: string; tone: "warn" | "fix" };

export type Out =
  | { kind: "email"; to: string; subject: string; body: string; done: string }
  | { kind: "chat"; with: string; msgs: { me?: true; text: string }[]; done: string }
  | { kind: "invoice"; title: string; paper: string[]; fields: [string, string][]; done: string }
  | { kind: "sheet"; title: string; cols: string[]; rows: string[][]; done: string }
  | { kind: "calendar"; title: string; days: string[]; events: { day: number; time: string; label: string }[]; done: string }
  | { kind: "post"; account: string; image: string; caption: string; done: string };

export type Approval = { at: number; ask: string; detail: string; yes: string; no: string };

export type Task = {
  id: string;
  text: string;
  hours: number;
  color: Color;
  agent: string;
  steps: StepItem[];
  result: string;
  out: Out;
  approval?: Approval;
  human?: false;
};
export type HumanTask = { id: string; text: string; hours: number; color: Color; human: true; handback: string };
export type AnyTask = Task | HumanTask;

export type Business = { id: string; label: string; name: string; Icon: LucideIcon; tasks: AnyTask[] };

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const businesses: Business[] = [
  {
    id: "restaurant", label: "Restaurant or café", name: "Lotus Kitchen", Icon: UtensilsCrossed,
    tasks: [
      {
        id: "r-enq", text: "Answer 26 booking & menu enquiries", hours: 3, color: "yellow", agent: "Guest agent",
        steps: ["Reading 26 messages from WhatsApp, email and Instagram", "Checking table availability", "Answering menu and allergy questions", "Confirming bookings"],
        result: "26 answered · 9 tables booked",
        out: { kind: "chat", with: "Dilani · WhatsApp", done: "Booking R-2291 saved to your reservations", msgs: [
          { text: "Hi! Do you have a table for 6 this Saturday around 8? One of us is vegan 🌱" },
          { me: true, text: "Hi Dilani! Yes, I can give you table 12 by the window at 8:00 pm on Saturday for 6." },
          { me: true, text: "For your vegan guest: the jackfruit curry, vegetable kottu (no egg) and coconut sambol hoppers are all fully vegan." },
          { text: "Perfect, please book it!" },
          { me: true, text: "Done ✅ Booking R-2291 for 6 at 8:00 pm Saturday. See you then!" },
        ] },
      },
      {
        id: "r-bills", text: "Enter 34 supplier bills into accounts", hours: 2.5, color: "pink", agent: "Docs agent",
        steps: ["Reading 34 bills (PDFs and phone photos)", { text: "Bill #19 is a blurry photo: the total can't be read", tone: "warn" }, { text: "Matched it against the signed delivery note instead", tone: "fix" }, "Posting to your accounts", "Checking prices against last month"],
        result: "34 posted · coconut oil up 38%, flagged for you",
        out: { kind: "invoice", title: "Bill 7 of 34", done: "Posted to accounts · ledger 5010 Food costs",
          paper: ["CEYLON FRESH PRODUCE (PVT) LTD", "No. 42, Manning Market, Colombo 11", "TAX INVOICE   CF-08812", "Date: 14/10/2026", "------------------------------", "Coconut oil 20L ......  32,400", "Red onions 25kg ......  11,250", "Tomatoes 15kg ........   6,900", "Green chillies 5kg ...   4,800", "Leeks / carrots ......  29,000", "------------------------------", "TOTAL LKR             84,350.00", "Pay by 28/10/2026"],
          fields: [["Supplier", "Ceylon Fresh Produce"], ["Invoice no.", "CF-08812"], ["Date", "14 Oct 2026"], ["Lines", "5 items"], ["Total", "LKR 84,350.00"], ["Due", "28 Oct 2026"]] },
      },
      {
        id: "r-stock", text: "Reorder stock for the weekend", hours: 2, color: "blue", agent: "Operations agent",
        steps: ["Checking stock levels", "Forecasting weekend covers from bookings", "Comparing three suppliers' prices", "Drafting purchase orders", "Sending orders"],
        result: "3 orders placed · delivery Friday 8 am",
        approval: { at: 0.62, ask: "Place 3 orders totalling LKR 186,400?", detail: "Ceylon Fresh, Prime Meats and PackRight · delivery Friday 8 am", yes: "3 orders placed · delivery Friday 8 am", no: "Orders saved as drafts for you" },
        out: { kind: "sheet", title: "Weekend order plan", done: "Orders sent to 3 suppliers", cols: ["Item", "In stock", "Needed", "Order"], rows: [
          ["Basmati rice", "18 kg", "60 kg", "50 kg"], ["Chicken", "22 kg", "70 kg", "50 kg"], ["Prawns", "4 kg", "15 kg", "12 kg"], ["Coconut oil", "6 L", "25 L", "20 L"], ["Takeaway boxes", "140", "600", "500"],
        ] },
      },
      {
        id: "r-report", text: "Build the weekly sales report", hours: 2, color: "green", agent: "Analyst agent",
        steps: ["Pulling sales from the POS", "Comparing with last week", "Finding what changed", "Writing the summary"],
        result: "Sent to partners · revenue +7%, Tuesday lunch slipping",
        out: { kind: "sheet", title: "Week 42 · sales by day", done: "Report emailed to the partners", cols: ["Day", "Covers", "Revenue", "vs last wk"], rows: [
          ["Mon", "84", "LKR 412K", "+4%"], ["Tue", "61", "LKR 288K", "−12%"], ["Wed", "92", "LKR 455K", "+6%"], ["Thu", "103", "LKR 521K", "+9%"], ["Fri", "168", "LKR 948K", "+11%"], ["Sat", "201", "LKR 1.14M", "+8%"], ["Sun", "176", "LKR 932K", "+10%"],
        ] },
      },
      {
        id: "r-social", text: "Post this week's specials on social", hours: 1.5, color: "orange", agent: "Marketing agent",
        steps: ["Picking the week's best dishes", "Writing posts in your voice", "Creating the images", "Scheduling for peak times"],
        result: "4 posts scheduled · Instagram & Facebook",
        out: { kind: "post", account: "lotuskitchen.lk", image: "Crab Curry Fridays are back", done: "Scheduled · Friday 6:00 pm", caption: "Crab Curry Fridays are back 🦀 Fresh from Negombo every morning and slow-cooked to our grandmother's recipe. Tables go fast, so book through the link in our bio. #ColomboEats #SriLankanFood" },
      },
      {
        id: "r-rota", text: "Make next week's staff rota", hours: 2, color: "purple", agent: "Rota agent",
        steps: ["Reading availability from 14 staff", "Matching shifts to forecast covers", { text: "Amara is on leave Wednesday: she was rostered for dinner", tone: "warn" }, { text: "Swapped in Ruwan, who asked for extra shifts", tone: "fix" }, "Sharing the rota on WhatsApp"],
        result: "Rota shared with 14 staff",
        out: { kind: "calendar", title: "Kitchen & floor rota · week 43", days: WEEKDAYS, done: "Shared with 14 staff on WhatsApp", events: [
          { day: 0, time: "Lunch", label: "Kasun, Nimali" }, { day: 0, time: "Dinner", label: "Amara, Ruwan, Ishan" }, { day: 1, time: "Lunch", label: "Nimali, Tharu" }, { day: 1, time: "Dinner", label: "Kasun, Amara" }, { day: 2, time: "Lunch", label: "Ishan, Tharu" }, { day: 2, time: "Dinner", label: "Ruwan (for Amara), Kasun" }, { day: 3, time: "Lunch", label: "Nimali, Ishan" }, { day: 3, time: "Dinner", label: "Amara, Tharu, Kasun" }, { day: 4, time: "Lunch", label: "Ruwan, Nimali" }, { day: 4, time: "Dinner", label: "Full team · 6" },
        ] },
      },
      { id: "r-human", text: "Taste-test the new menu with the chef", hours: 2, color: "yellow", human: true, handback: "This needs you in the kitchen. I've collected guest feedback on the current dishes and costed each new recipe, so you can decide on the spot." },
    ],
  },
  {
    id: "hotel", label: "Hotel or guest house", name: "Lagoon Bay Hotel", Icon: BedDouble,
    tasks: [
      {
        id: "h-enq", text: "Answer 31 guest enquiries", hours: 3, color: "yellow", agent: "Reservations agent",
        steps: ["Reading enquiries from Booking.com, email and WhatsApp", "Checking room availability", "Answering and upselling transfers", "Updating bookings"],
        result: "31 answered · 6 add-ons sold (LKR 74K)",
        out: { kind: "chat", with: "Mark · Booking.com", done: "Booking LB-4471 updated with transfer", msgs: [
          { text: "Hi, is an airport pickup possible on 12 Nov? I land at 6:40 am." },
          { me: true, text: "Hello Mark! Yes. A driver will meet you at arrivals at 6:40 am on 12 Nov with a Lagoon Bay sign. The transfer is LKR 9,500, added to your bill." },
          { text: "Great. Any chance of early check-in?" },
          { me: true, text: "Your room will be ready from 9:00 am at no extra charge. Booking LB-4471 updated ✅" },
        ] },
      },
      {
        id: "h-chase", text: "Chase 9 unpaid corporate invoices", hours: 2, color: "pink", agent: "Finance agent",
        steps: ["Finding 9 overdue invoices", "Matching against the bank feed", "Writing polite reminders", "Scheduling follow-ups"],
        result: "LKR 2.9M chased · 4 paid the same day",
        out: { kind: "email", to: "accounts@brightlogistics.lk", subject: "Friendly reminder: invoice LB-INV-0932 (LKR 412,000)", done: "Sent · follow-up scheduled in 5 days",
          body: "Dear Accounts team,\n\nI hope you're well. Our records show invoice LB-INV-0932, for your team's stay on 3–6 September, is now 21 days overdue.\n\nAmount due: LKR 412,000\nBank: Commercial Bank · A/C 1000 2345 678\n\nIf you've already paid, please ignore this note. Otherwise, could you let us know when we can expect payment?\n\nWarm regards,\nLagoon Bay Hotel · Accounts" },
      },
      {
        id: "h-rates", text: "Set room rates for next month", hours: 2.5, color: "blue", agent: "Revenue agent",
        steps: ["Reading next month's bookings", "Checking 4 competitors' prices", "Spotting high-demand dates", "Building the new rate plan", "Publishing to booking channels"],
        result: "Rates live on Booking.com, Agoda and website",
        approval: { at: 0.7, ask: "Publish new rates to 3 booking channels?", detail: "Weekdays −8%, festival weekend +22%", yes: "Rates live on Booking.com, Agoda and website", no: "Rate plan saved for you to review" },
        out: { kind: "sheet", title: "November rate plan · Deluxe room", done: "Published to 3 channels", cols: ["Dates", "Demand", "Market", "New rate"], rows: [
          ["1–7 Nov", "Low", "LKR 21.9K", "LKR 22,500"], ["8–14 Nov", "Medium", "LKR 23.1K", "LKR 24,500"], ["15–17 Nov (festival)", "Very high", "LKR 31.0K", "LKR 29,900"], ["18–24 Nov", "Low", "LKR 21.4K", "LKR 22,000"], ["25–30 Nov", "Medium", "LKR 23.8K", "LKR 24,500"],
        ] },
      },
      {
        id: "h-docs", text: "Process 52 supplier invoices", hours: 3, color: "green", agent: "Docs agent",
        steps: ["Reading 52 invoices", "Extracting totals and due dates", { text: "Ocean Linen billed twice for the same delivery", tone: "warn" }, { text: "Stopped the duplicate and emailed the supplier", tone: "fix" }, "Posting to accounts"],
        result: "51 posted · 1 duplicate stopped (LKR 68K)",
        out: { kind: "invoice", title: "Invoice 23 of 52", done: "Posted · duplicate of OL-2207 blocked",
          paper: ["OCEAN LINEN SERVICES", "Laundry & linen hire · Negombo", "INVOICE   OL-2231", "Date: 11/10/2026", "------------------------------", "Bed linen sets x 180 ..  41,400", "Bath towels x 240 .....  19,200", "Pool towels x 90 ......   7,650", "------------------------------", "TOTAL LKR             68,250.00", "Terms: 14 days"],
          fields: [["Supplier", "Ocean Linen Services"], ["Invoice no.", "OL-2231"], ["Date", "11 Oct 2026"], ["Total", "LKR 68,250.00"], ["Check", "Same items as OL-2207 ⚠"], ["Action", "Held, supplier asked"]] },
      },
      {
        id: "h-house", text: "Plan housekeeping for 48 rooms", hours: 2, color: "orange", agent: "Operations agent",
        steps: ["Reading check-ins and check-outs", "Prioritising early arrivals", "Assigning rooms to 6 housekeepers", "Sending the plan to their phones"],
        result: "Plan sent to 6 housekeepers",
        out: { kind: "calendar", title: "Housekeeping plan · this week", days: WEEKDAYS, done: "Sent to 6 housekeepers", events: [
          { day: 0, time: "9:00", label: "Rooms 101–112 · Malini" }, { day: 0, time: "11:00", label: "Early arrival 204 · Priya" }, { day: 1, time: "9:00", label: "Rooms 201–214 · Sunil" }, { day: 1, time: "14:00", label: "Deep clean 305 · Malini" }, { day: 2, time: "9:00", label: "Rooms 301–316 · Priya" }, { day: 3, time: "9:00", label: "Rooms 101–120 · team" }, { day: 4, time: "8:00", label: "Wedding wing · full team" },
        ] },
      },
      {
        id: "h-report", text: "Write the monthly owner's report", hours: 2.5, color: "purple", agent: "Analyst agent",
        steps: ["Pulling occupancy and revenue", "Comparing with last month", "Reading review scores", "Writing the summary"],
        result: "Report sent to owners · RevPAR +12%",
        out: { kind: "sheet", title: "October · owner's report", done: "Emailed to the owners", cols: ["Metric", "October", "September"], rows: [
          ["Occupancy", "74%", "68%"], ["Average rate", "LKR 24,100", "LKR 23,400"], ["RevPAR", "LKR 17,834", "LKR 15,912"], ["Review score", "4.6 ★", "4.4 ★"], ["Direct bookings", "31%", "26%"],
        ] },
      },
      { id: "h-human", text: "Welcome the VIP wedding party", hours: 2, color: "yellow", human: true, handback: "This needs you in person. I've prepared the guest list with names, dietary needs and room assignments, and set reminders for your team." },
    ],
  },
  {
    id: "clinic", label: "Clinic or healthcare", name: "Harbour Family Clinic", Icon: Stethoscope,
    tasks: [
      {
        id: "c-confirm", text: "Confirm tomorrow's 42 appointments", hours: 2.5, color: "yellow", agent: "Front desk agent",
        steps: ["Reading tomorrow's schedule", "Messaging 42 patients", "Handling reschedules", "Filling freed slots from the waitlist"],
        result: "39 confirmed · 3 moved · 0 empty slots",
        out: { kind: "chat", with: "Mrs. Perera · SMS", done: "Appointment moved to 3:30 pm", msgs: [
          { me: true, text: "Good evening Mrs. Perera, a reminder of your appointment with Dr. Fernando tomorrow at 10:15 am. Reply 1 to confirm or 2 to reschedule." },
          { text: "2. Can I come in the afternoon?" },
          { me: true, text: "Of course. Dr. Fernando has 3:30 pm or 4:45 pm free tomorrow. Which suits you?" },
          { text: "3:30 please" },
          { me: true, text: "Done ✅ You're booked for 3:30 pm tomorrow. Please bring your previous reports." },
        ] },
      },
      {
        id: "c-claims", text: "Submit 28 insurance claims", hours: 3, color: "pink", agent: "Claims agent",
        steps: ["Reading 28 claim forms", "Checking codes and policy numbers", { text: "Claim #11 is missing the doctor's signature", tone: "warn" }, { text: "Asked Dr. Fernando to sign; holding that one claim", tone: "fix" }, "Submitting to insurers"],
        result: "27 submitted · 1 waiting on a signature",
        out: { kind: "invoice", title: "Claim 4 of 28", done: "Submitted to AIA · ref CLM-55120",
          paper: ["HARBOUR FAMILY CLINIC", "Outpatient claim form", "Insurer: AIA Insurance Lanka", "------------------------------", "Patient: K. Silva", "Policy: AIA-77120394", "Visit: 09/10/2026", "Doctor: Dr. S. Fernando", "Consultation .........  4,500", "Lab tests ............  8,300", "------------------------------", "CLAIM TOTAL LKR       12,800.00"],
          fields: [["Patient", "K. Silva"], ["Policy no.", "AIA-77120394"], ["Visit", "9 Oct 2026"], ["Doctor", "Dr. S. Fernando"], ["Amount", "LKR 12,800.00"], ["Signature", "Present ✓"]] },
      },
      {
        id: "c-supplies", text: "Reorder medical supplies", hours: 1.5, color: "blue", agent: "Operations agent",
        steps: ["Counting stock from usage logs", "Checking expiry dates", "Comparing supplier prices", "Preparing the order", "Placing the order"],
        result: "Order placed with MediLanka · delivery Thursday",
        approval: { at: 0.68, ask: "Order supplies from MediLanka for LKR 148,200?", detail: "12% cheaper than your usual supplier · delivery Thursday", yes: "Order placed with MediLanka · delivery Thursday", no: "Order saved as a draft for you" },
        out: { kind: "sheet", title: "Supplies to reorder", done: "Order sent to MediLanka", cols: ["Item", "Left", "Weekly use", "Order"], rows: [
          ["Nitrile gloves (box)", "6", "14", "40"], ["Syringes 5 ml", "120", "300", "900"], ["Alcohol swabs", "400", "1,200", "3,000"], ["Gauze pads", "90", "250", "600"], ["Paracetamol 500 mg", "2 boxes", "5 boxes", "15 boxes"],
        ] },
      },
      {
        id: "c-results", text: "Notify 35 patients their results are ready", hours: 2, color: "green", agent: "Care team agent",
        steps: ["Finding results the doctor has signed off", "Writing a note for each patient", "Sending by email and SMS", "Booking follow-ups where the doctor asked"],
        result: "35 notified · 4 follow-ups booked",
        out: { kind: "email", to: "nimal.j@gmail.com", subject: "Your test results are ready", done: "Sent · copy saved to patient record",
          body: "Dear Mr. Jayasuriya,\n\nYour blood test results from 14 October are ready. Dr. Fernando has reviewed them and everything is within the normal range.\n\nYou can view the full report in the patient portal, or collect a printed copy from reception.\n\nIf you have any questions, reply to this email or call us on 011 234 5678.\n\nHarbour Family Clinic" },
      },
      {
        id: "c-schedule", text: "Fill gaps in next week's doctor schedule", hours: 2, color: "orange", agent: "Scheduling agent",
        steps: ["Finding 11 empty slots", "Matching waitlisted patients", "Offering slots by SMS", "Booking the ones accepted"],
        result: "9 of 11 gaps filled",
        out: { kind: "calendar", title: "Dr. Fernando · next week", days: WEEKDAYS, done: "9 of 11 gaps filled from the waitlist", events: [
          { day: 0, time: "9:30", label: "R. Gunawardena · follow-up" }, { day: 0, time: "15:00", label: "A. Dias · new patient" }, { day: 1, time: "11:15", label: "S. Rahman · review" }, { day: 2, time: "10:00", label: "M. Perera · BP check" }, { day: 2, time: "16:30", label: "T. Silva · results" }, { day: 3, time: "9:00", label: "N. Fonseka · new patient" }, { day: 3, time: "14:45", label: "K. Wijesinghe · review" }, { day: 4, time: "10:30", label: "D. Ranasinghe · vaccine" }, { day: 4, time: "12:00", label: "P. Kumar · follow-up" },
        ] },
      },
      {
        id: "c-bills", text: "Chase 14 unpaid patient bills", hours: 1.5, color: "purple", agent: "Billing agent",
        steps: ["Finding 14 unpaid bills", "Checking for insurance cover first", "Sending gentle reminders with a pay link", "Logging replies"],
        result: "14 reminded · LKR 186K collected so far",
        out: { kind: "email", to: "dilshan.w@outlook.com", subject: "Your bill from Harbour Family Clinic", done: "Sent with a secure payment link",
          body: "Dear Mr. Wickramasinghe,\n\nThank you for visiting us on 2 October. A balance of LKR 6,400 is still open on your account after your insurance payment.\n\nYou can pay securely online here: pay.harbourclinic.lk/b/3318\n\nIf you think this is a mistake, just reply and we'll look into it.\n\nKind regards,\nHarbour Family Clinic · Billing" },
      },
      { id: "c-human", text: "Talk a worried patient through a diagnosis", hours: 2, color: "yellow", human: true, handback: "This needs a doctor, not an agent. I've pulled their history, recent results and notes into one page so the conversation goes smoothly." },
    ],
  },
  {
    id: "retail", label: "Retail shop", name: "UrbanThreads", Icon: ShoppingBag,
    tasks: [
      {
        id: "s-msgs", text: "Answer 40 customer messages", hours: 3, color: "yellow", agent: "Support agent",
        steps: ["Reading 40 messages from Instagram, WhatsApp and email", "Checking live stock", "Answering and sending checkout links", "Tagging sales in the CRM"],
        result: "40 answered · 11 sales (LKR 186K)",
        out: { kind: "chat", with: "Shehani · Instagram", done: "Sale tracked · order UT-8821", msgs: [
          { text: "Is the linen shirt in white available in M? 😊" },
          { me: true, text: "Hi Shehani! Yes, we have 3 left in white, size M, at our Colombo 7 store and online." },
          { me: true, text: "Shall I reserve one for pickup today, or send you a checkout link with free delivery?" },
          { text: "Link please!" },
          { me: true, text: "Here you go 👉 urbanthreads.lk/c/8821 · free delivery in Colombo by tomorrow ✅" },
        ] },
      },
      {
        id: "s-stock", text: "Rebalance stock across 3 stores", hours: 2.5, color: "pink", agent: "Inventory agent",
        steps: ["Reading sales and stock by store", "Forecasting the weekend", "Finding slow stock to move", "Booking transfers", "Ordering the shortfall"],
        result: "40 units moved · 180 ordered for Friday",
        approval: { at: 0.6, ask: "Move 40 units from Kandy and order 180 more?", detail: "Transfer arrives Thursday · supplier order LKR 612,000", yes: "40 units moved · 180 ordered for Friday", no: "Transfer and order saved as drafts" },
        out: { kind: "sheet", title: "Best-sellers · weekend cover", done: "Transfer TR-552 booked · PO-8817 sent", cols: ["Item", "Colombo 7", "Kandy", "Action"], rows: [
          ["Linen shirt · White M", "2 left", "24", "Move 15"], ["Denim jacket · Blue L", "1 left", "18", "Move 12"], ["Canvas sneakers · 42", "3 left", "22", "Move 13"], ["All three", "Sold out Fri", "Slow", "Order 180"],
        ] },
      },
      {
        id: "s-returns", text: "Process 22 returns and refunds", hours: 2, color: "blue", agent: "Returns agent",
        steps: ["Reading 22 return requests", "Checking order history and photos", { text: "Return #14 is past the 30-day window", tone: "warn" }, { text: "Offered store credit instead, as your policy allows", tone: "fix" }, "Issuing refunds"],
        result: "21 refunded · 1 given store credit",
        out: { kind: "email", to: "tharindu.p@gmail.com", subject: "Your refund for order UT-7740", done: "Refund of LKR 7,490 issued",
          body: "Hi Tharindu,\n\nThanks for sending back the linen shirt. It arrived today in perfect condition, so we've refunded LKR 7,490 to your card ending 4417.\n\nIt usually shows in your account within 3–5 working days.\n\nIf the size was the issue, the same shirt in L is back in stock. Here's 10% off if you'd like to try it: SWAP10\n\nUrbanThreads" },
      },
      {
        id: "s-bills", text: "Enter 19 supplier invoices", hours: 1.5, color: "green", agent: "Docs agent",
        steps: ["Reading 19 invoices", "Matching each to a purchase order", "Extracting totals and due dates", "Posting to accounts"],
        result: "19 posted · all matched to orders",
        out: { kind: "invoice", title: "Invoice 6 of 19", done: "Posted · matched to PO-8790",
          paper: ["THREADLINE APPAREL (PVT) LTD", "Biyagama Export Zone", "INVOICE   TA-11902", "Date: 10/10/2026", "PO ref: PO-8790", "------------------------------", "Linen shirts x 120 ... 336,000", "Denim jackets x 60 ... 252,000", "------------------------------", "TOTAL LKR            588,000.00", "Due: 09/11/2026"],
          fields: [["Supplier", "Threadline Apparel"], ["Invoice no.", "TA-11902"], ["PO match", "PO-8790 ✓"], ["Total", "LKR 588,000.00"], ["Due", "9 Nov 2026"], ["Ledger", "5000 Stock purchases"]] },
      },
      {
        id: "s-listings", text: "Write listings for 30 new arrivals", hours: 3, color: "orange", agent: "Content agent",
        steps: ["Reading product photos and specs", "Writing descriptions in your brand voice", "Adding sizes and prices", "Publishing to the website"],
        result: "30 listings live on the website",
        out: { kind: "post", account: "urbanthreads.lk · new arrival", image: "Breezy Linen Shirt", done: "Published to the website", caption: "Breezy Linen Shirt · White. Cut from 100% Belgian linen that stays cool in Colombo heat, with a relaxed fit, mother-of-pearl buttons and a curved hem that looks sharp tucked or untucked. Sizes S–XL · LKR 7,490" },
      },
      {
        id: "s-email", text: "Plan the weekend sale email", hours: 1.5, color: "purple", agent: "Marketing agent",
        steps: ["Choosing who should get it", "Picking products they've browsed", "Writing the email", "Scheduling for Friday 7 pm"],
        result: "Scheduled to 4,820 customers",
        out: { kind: "email", to: "4,820 customers · past 12 months", subject: "This weekend only: 25% off linen 🌴", done: "Scheduled · Friday 7:00 pm",
          body: "Hi {first name},\n\nThe heat's not going anywhere, so neither is our linen. This weekend only, take 25% off every linen shirt, dress and trouser, in store and online.\n\nYou looked at the Breezy Linen Shirt last week, and it's back in your size.\n\nShop now: urbanthreads.lk/linen\n\nSee you this weekend,\nUrbanThreads" },
      },
      { id: "s-human", text: "Negotiate next season's prices with suppliers", hours: 2, color: "yellow", human: true, handback: "This needs you at the table. I've built a briefing with last year's volumes, price history and three suppliers' latest quotes." },
    ],
  },
  {
    id: "office", label: "Office or professional services", name: "Ardent Consulting", Icon: Briefcase,
    tasks: [
      {
        id: "o-inbox", text: "Reply to 45 client emails", hours: 4, color: "yellow", agent: "Inbox agent",
        steps: ["Reading 45 emails", "Sorting by urgency", "Drafting replies in your tone", "Sending the routine ones", "Flagging 6 that need you"],
        result: "39 sent · 6 flagged for you",
        out: { kind: "email", to: "ravi@kandyexports.lk", subject: "Re: Updated proposal timeline", done: "Sent · 38 more like this",
          body: "Hi Ravi,\n\nThanks for the quick turnaround on your comments. We've folded them into the proposal, and the updated version is attached.\n\nThe new timeline is:\n• Discovery workshops: 3–7 November\n• Draft recommendations: 21 November\n• Final report: 5 December\n\nWould Thursday at 10 am work for a 30-minute call to walk through it?\n\nBest regards,\nArdent Consulting" },
      },
      {
        id: "o-invoices", text: "Chase 11 overdue client invoices", hours: 2, color: "pink", agent: "Finance agent",
        steps: ["Finding 11 overdue invoices", "Checking which were part-paid", "Sending reminders", "Logging promised payment dates"],
        result: "LKR 4.6M chased · 5 payment dates promised",
        out: { kind: "email", to: "finance@serendibfoods.lk", subject: "Reminder: invoice AC-2026-118 (LKR 1,250,000)", done: "Sent · follow-up in 7 days",
          body: "Dear Finance team,\n\nA quick reminder that invoice AC-2026-118 for the September strategy workshops was due on 30 September.\n\nAmount: LKR 1,250,000\n\nCould you confirm when payment is scheduled? If anything on the invoice needs correcting, just let me know.\n\nKind regards,\nArdent Consulting · Accounts" },
      },
      {
        id: "o-meetings", text: "Schedule 9 client meetings", hours: 2, color: "blue", agent: "Scheduling agent",
        steps: ["Reading everyone's availability", "Proposing times to 9 clients", { text: "Two clients asked for the same Tuesday slot", tone: "warn" }, { text: "Offered the second Wednesday 10 am, and they accepted", tone: "fix" }, "Sending calendar invites"],
        result: "9 meetings booked",
        out: { kind: "calendar", title: "Client meetings · next week", days: WEEKDAYS, done: "9 invites sent and accepted", events: [
          { day: 0, time: "10:00", label: "Kandy Exports · kickoff" }, { day: 0, time: "15:00", label: "Serendib Foods · review" }, { day: 1, time: "11:00", label: "BlueWave · proposal" }, { day: 2, time: "10:00", label: "Lanka Tiles (moved)" }, { day: 2, time: "14:30", label: "Metro Bank · workshop" }, { day: 3, time: "9:30", label: "Ceylon Tea Co. · call" }, { day: 3, time: "16:00", label: "Orbit Labs · demo" }, { day: 4, time: "11:00", label: "Hill Country Hotels" }, { day: 4, time: "14:00", label: "GreenGrid · check-in" },
        ] },
      },
      {
        id: "o-receipts", text: "Enter 63 expense receipts", hours: 2.5, color: "green", agent: "Docs agent",
        steps: ["Reading 63 receipt photos", "Extracting amounts and categories", "Matching to client projects", "Posting expense claims"],
        result: "63 posted · LKR 48K billable to clients",
        out: { kind: "invoice", title: "Receipt 17 of 63", done: "Posted · billable to Kandy Exports",
          paper: ["PICKME RIDES", "Trip receipt", "13 Oct 2026  08:12", "Colombo 3 -> Kandy", "------------------------------", "Fare ................  11,400", "Tolls ................   1,100", "------------------------------", "TOTAL LKR             12,500.00", "Paid: Visa ****2201"],
          fields: [["Merchant", "PickMe"], ["Date", "13 Oct 2026"], ["Category", "Travel"], ["Amount", "LKR 12,500.00"], ["Project", "Kandy Exports"], ["Billable", "Yes"]] },
      },
      {
        id: "o-report", text: "Prepare the monthly management report", hours: 3, color: "orange", agent: "Analyst agent",
        steps: ["Pulling timesheets and invoices", "Calculating utilisation and margins", "Comparing with targets", "Writing the commentary"],
        result: "Report ready · utilisation up to 78%",
        out: { kind: "sheet", title: "October · management report", done: "Shared with the partners", cols: ["Metric", "October", "Target"], rows: [
          ["Billable utilisation", "78%", "75%"], ["Revenue", "LKR 18.4M", "LKR 17.0M"], ["Gross margin", "41%", "40%"], ["Overdue invoices", "LKR 4.6M", "< LKR 3M"], ["New proposals", "7", "6"],
        ] },
      },
      {
        id: "o-leads", text: "Follow up on 18 new leads", hours: 2, color: "purple", agent: "Sales agent",
        steps: ["Scoring 18 leads", "Researching each company", "Writing personal follow-ups", "Sending and booking calls"],
        result: "18 contacted · 5 calls booked",
        approval: { at: 0.55, ask: "Offer a 10% early-signing discount to the 5 hottest leads?", detail: "Valid for 14 days · worth up to LKR 1.1M in fees", yes: "18 contacted · 5 calls booked, 2 already accepted the offer", no: "18 contacted at standard pricing · 4 calls booked" },
        out: { kind: "email", to: "anushka@orbitlabs.io", subject: "Following up on your enquiry", done: "Sent · call booked for Wednesday 3 pm",
          body: "Hi Anushka,\n\nThanks for reaching out about streamlining Orbit Labs' operations. I took a look at your growth over the last year, and three areas usually pay back fastest for teams your size: approvals, reporting and client onboarding.\n\nWould a 20-minute call on Wednesday at 3 pm work to talk it through?\n\nBest,\nArdent Consulting" },
      },
      { id: "o-human", text: "Present the proposal to the board", hours: 2, color: "yellow", human: true, handback: "This needs you in the room. I've drafted the slides, pulled the numbers and listed the 5 questions they're most likely to ask." },
    ],
  },
];

/* ───────── The visitor's own notes ───────── */

const HUMAN = /\b(meet (with|our|the|my)|visit|negotiat|present(ation)? to|pitch to|in person|lunch with|dinner with|interview (the|a|our)|hug|celebrate)\b/i;

type Template = { match: RegExp; agent: string; build: (text: string, cap: string) => Pick<Task, "steps" | "result" | "out"> };

const TEMPLATES: Template[] = [
  {
    match: /invoice|bill|receipt|expense|payment|pay |accounts?|tax|vat|payroll|salar/i, agent: "Finance agent",
    build: (t, cap) => ({
      steps: [`Breaking down “${t}”`, "Collecting the documents", "Extracting amounts and dates", "Posting and reconciling"],
      result: "Done and reconciled · nothing missing",
      out: { kind: "invoice", title: cap, done: "Posted and reconciled", paper: ["SUPPLIER / CLIENT DOCUMENT", "------------------------------", "Ref ............... INV-20931", "Date .............. 14/10/2026", "Items ............. 6 lines", "------------------------------", "TOTAL LKR            126,400.00"], fields: [["Reference", "INV-20931"], ["Date", "14 Oct 2026"], ["Amount", "LKR 126,400.00"], ["Status", "Matched ✓"]] },
    }),
  },
  {
    match: /stock|order|supplier|inventory|reorder|purchase|deliver/i, agent: "Operations agent",
    build: (t, cap) => ({
      steps: [`Breaking down “${t}”`, "Checking current levels", "Comparing supplier prices", "Placing the orders"],
      result: "Orders placed · 9% cheaper than usual",
      out: { kind: "sheet", title: cap, done: "Orders sent to suppliers", cols: ["Item", "Now", "Needed", "Order"], rows: [["Item A", "12", "40", "30"], ["Item B", "4", "25", "25"], ["Item C", "30", "35", "10"]] },
    }),
  },
  {
    match: /lead|sales|quote|proposal|prospect|follow.?up|client/i, agent: "Sales agent",
    build: (t, cap) => ({
      steps: [`Breaking down “${t}”`, "Researching who's involved", "Writing personal messages", "Sending and booking next steps"],
      result: "Sent · 3 replies and 2 calls booked so far",
      out: { kind: "email", to: "your contacts", subject: cap, done: "Sent · replies tracked in your CRM", body: `Hi {first name},\n\nI wanted to follow up personally. ${cap} is on our list this week, and I'd love to make it easy for you.\n\nWould a quick 15-minute call on Thursday work? If another time suits better, just reply with what works.\n\nBest regards` },
    }),
  },
  {
    match: /email|inbox|repl|enquir|message|whatsapp|customer|complain|review/i, agent: "Support agent",
    build: (t, cap) => ({
      steps: [`Breaking down “${t}”`, "Reading everything that's waiting", "Drafting replies in your tone", "Sending and flagging the tricky ones"],
      result: "All answered · 3 flagged for you",
      out: { kind: "email", to: "customer", subject: `Re: ${cap}`, done: "Sent · the rest follow the same way", body: "Hi there,\n\nThanks for getting in touch, and sorry for the wait. I've looked into this for you.\n\nEverything is sorted on our side, and you'll get a confirmation shortly. If anything still isn't right, just reply here and we'll fix it.\n\nKind regards" },
    }),
  },
  {
    match: /report|analy|numbers|dashboard|kpi|figures|forecast|budget/i, agent: "Analyst agent",
    build: (t, cap) => ({
      steps: [`Breaking down “${t}”`, "Pulling data from your systems", "Comparing with last period", "Writing the summary"],
      result: "Report ready · 2 things worth your attention",
      out: { kind: "sheet", title: cap, done: "Shared with your team", cols: ["Metric", "This period", "Last period"], rows: [["Revenue", "LKR 6.2M", "LKR 5.8M"], ["Orders", "1,284", "1,190"], ["Average order", "LKR 4,830", "LKR 4,870"], ["Costs", "LKR 3.9M", "LKR 3.5M"]] },
    }),
  },
  {
    match: /post|social|instagram|facebook|tiktok|marketing|newsletter|campaign|promo|advert/i, agent: "Marketing agent",
    build: (t, cap) => ({
      steps: [`Breaking down “${t}”`, "Finding what your audience likes", "Writing in your voice", "Scheduling for peak times"],
      result: "Scheduled for peak times",
      out: { kind: "post", account: "your business", image: cap, done: "Scheduled · Friday 6:00 pm", caption: `${cap}. Something new is coming this week, and we can't wait to show you. Follow along and be first to know ✨` },
    }),
  },
  {
    match: /schedul|meeting|appointment|book|calendar|rota|roster|shift/i, agent: "Scheduling agent",
    build: (t, cap) => ({
      steps: [`Breaking down “${t}”`, "Reading everyone's availability", "Finding times that work", "Sending invites"],
      result: "All booked · invites accepted",
      out: { kind: "calendar", title: cap, days: WEEKDAYS, done: "Invites sent and accepted", events: [{ day: 0, time: "10:00", label: "Booked" }, { day: 1, time: "14:00", label: "Booked" }, { day: 3, time: "11:30", label: "Booked" }, { day: 4, time: "9:00", label: "Booked" }] },
    }),
  },
  {
    match: /hire|hiring|cv|candidate|recruit|applica|job/i, agent: "HR agent",
    build: (t, cap) => ({
      steps: [`Breaking down “${t}”`, "Reading every application", "Matching against the role", "Shortlisting and inviting"],
      result: "Shortlist ready · interviews offered",
      out: { kind: "sheet", title: cap, done: "Interview invites sent", cols: ["Candidate", "Match", "Next step"], rows: [["N. Perera", "92%", "Interview"], ["A. Rahman", "88%", "Interview"], ["S. Fernando", "81%", "Interview"], ["14 others", "< 60%", "Polite no"]] },
    }),
  },
];

const FALLBACK: Template = {
  match: /.*/, agent: "Admin agent",
  build: (t, cap) => ({
    steps: [`Breaking down “${t}”`, "Working out the steps", "Doing the routine parts", "Checking the result"],
    result: "Done · summary sent to you",
    out: { kind: "sheet", title: cap, done: "Summary sent to you", cols: ["Step", "Status"], rows: [["Gathered what's needed", "Done"], ["Completed the routine work", "Done"], ["Checked for problems", "Done"], ["Summarised for you", "Done"]] },
  }),
};

let seq = 0;
export function customTask(raw: string, hours: number): AnyTask {
  const text = raw.trim().replace(/\s+/g, " ");
  const cap = text.charAt(0).toUpperCase() + text.slice(1);
  const id = `own-${++seq}`;
  if (HUMAN.test(text))
    return { id, text: cap, hours, color: "green", human: true, handback: "This one needs you in person. I've gathered the background, put the key points on one page and blocked time in your calendar." };
  const tpl = TEMPLATES.find((x) => x.match.test(text)) ?? FALLBACK;
  return { id, text: cap, hours, color: "green", agent: tpl.agent, ...tpl.build(text, cap) };
}
