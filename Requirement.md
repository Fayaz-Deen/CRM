Create a  per-user individual CRM where each user signs up independently and manages their own contacts, meetings, and reminders without organization/team hierarchy.

Personal CRM – MVP Specification (Individual User Model)

1. MVP Goals
* Any individual can sign up and use the CRM independently
* Store and manage personal/business contacts
* Log date-wise meetings and communications
* Track birthdays & anniversaries with reminders
* Quick communication via WhatsApp, Email, SMS, Instagram
* Share specific contacts with other registered users
* View personal activity dashboard
* PWA for mobile & desktop with offline support

2. User Model
Single Role: Individual User
Each signup creates an independent account. No admin/manager hierarchy.
Aspect	Description
Signup	Email + Password OR Google OAuth
Data Ownership	User owns all their contacts, meetings, reminders
Sharing	Optional - share specific contacts with other users
Settings	Personal preferences (timezone, reminder lead time, theme)
3. Core Modules
Module 1: Authentication
Feature	Description
Email Signup	Register with email + password
Google OAuth	One-click signup/login via Gmail
Auto Profile Fetch	Pull name, email, profile picture from Google
Forgot Password	Email-based password reset
Session Management	JWT tokens with refresh mechanism
Account Settings	Update profile, change password, delete account
Module 2: User Settings (Personal)
Each user can configure:
Setting	Default
Display Name	From signup
Profile Picture	From Google or uploaded
Timezone	Auto-detected
Birthday Reminder Lead Time	2 days before
Anniversary Reminder Lead Time	2 days before
Default Follow-up Interval	7 days
Theme	Light/Dark
Notification Preferences	Push ON, Email ON
Module 3: Contacts
Fields:
Field	Type	Required
Name	String	Yes
Emails	Array	No
Phones	Array	No
WhatsApp Number	String	No
Instagram Handle	String	No
Company	String	No
Tags	Array	No
Address	String	No
Notes	Text	No
Birthday	Date	No
Anniversary	Date	No
Profile Picture	URL	No
Features:
* Create / Edit / Delete contacts
* Search by name, company, tags
* Filter by tags
* Contact detail page with interaction timeline
* Quick actions: Call, WhatsApp, Email, SMS, Instagram
* Import contacts (CSV upload - future)

Module 4: Meetings / Connects
Linked to each contact. Records every interaction.
Fields:
Field	Type	Required
Contact	Reference	Yes
Date & Time	DateTime	Yes
Medium	Enum	Yes
Notes	Text	No
Outcome	String	No
Follow-up Date	Date	No
Medium Options:
* Phone Call
* WhatsApp
* Email
* SMS
* In-Person
* Video Call
* Instagram DM
* Other
Features:
* Add meeting from contact page
* View full history per contact
* View all upcoming follow-ups (global list)
* Edit/delete meeting entries
* Auto-update "last contacted" on contact

Module 5: Reminders & Notifications
Reminder Types:
Type	Trigger Logic
Birthday	X days before + on the day
Anniversary	X days before + on the day
Follow-up Due	On the scheduled follow-up date (9 AM user timezone)
No Contact Alert	If no meeting logged in Y days (user-configurable)
Delivery Channels:
1. Web Push (PWA) - Primary
2. Email - Backup
3. In-App - Notification center
Notification Actions:
* Click → Opens contact page
* Quick actions: Mark done, Snooze, Dismiss

Module 6: Communication Shortcuts
Platform	Implementation
WhatsApp	Deep link: https://wa.me/{number}?text={prefilled}
Email	mailto: link with prefilled subject/body
SMS	sms:{number}?body={prefilled}
Instagram	Deep link: https://instagram.com/{handle}
Phone Call	tel:{number}
Pre-filled Templates:
* Follow-up message
* Birthday wish
* Anniversary wish
* Custom template (user can create)
Optional: Log communication as meeting entry with one tap.

Module 7: Sharing (Optional Feature)
User can share a contact with another registered user.
Share Settings:
Option	Values
Share With	Email of registered user
Permission	View Only / View + Add Notes
Expiry	Never / Custom date
Note	Optional message
Recipient Experience:
* Sees contact in "Shared with Me" section
* Cannot edit core contact details (unless permitted)
* Can view timeline
* Can add their own meeting notes (if permitted)

Module 8: Dashboard
Widgets:
Widget	Description
Total Contacts	Count
Meetings This Month	Count
Upcoming Birthdays	Next 7 days
Upcoming Anniversaries	Next 7 days
Pending Follow-ups	Overdue + upcoming
Recently Contacted	Last 5 contacts
Needs Attention	Not contacted in 30+ days
Charts:
* Meetings per week (bar)
* Communication medium breakdown (pie)
* Contacts added over time (line)

4. Data Model
USER
├── id (UUID)
├── email (unique)
├── password_hash (nullable if Google OAuth)
├── google_id (nullable)
├── name
├── profile_picture
├── timezone
├── settings (JSON)
│   ├── birthday_reminder_days
│   ├── anniversary_reminder_days
│   ├── default_followup_days
│   ├── theme
│   └── notification_prefs
├── created_at
└── updated_at

CONTACT
├── id (UUID)
├── user_id (FK → User) [Owner]
├── name
├── emails[] (JSON)
├── phones[] (JSON)
├── whatsapp_number
├── instagram_handle
├── company
├── tags[] (JSON)
├── address
├── notes
├── birthday
├── anniversary
├── profile_picture
├── last_contacted_at
├── created_at
└── updated_at

MEETING
├── id (UUID)
├── contact_id (FK → Contact)
├── user_id (FK → User)
├── meeting_date
├── medium (enum)
├── notes
├── outcome
├── followup_date
├── created_at
└── updated_at

REMINDER
├── id (UUID)
├── user_id (FK → User)
├── contact_id (FK → Contact)
├── type (enum: birthday/anniversary/followup/no_contact)
├── scheduled_at
├── sent_at
├── status (pending/sent/dismissed)
└── created_at

SHARE
├── id (UUID)
├── contact_id (FK → Contact)
├── owner_user_id (FK → User)
├── shared_with_user_id (FK → User)
├── permission (enum: view/view_add)
├── expires_at
├── note
└── created_at

MESSAGE_TEMPLATE
├── id (UUID)
├── user_id (FK → User)
├── name
├── type (followup/birthday/anniversary/custom)
├── content
└── created_at

5. Key User Flows
Flow 1: Signup
User clicks "Sign Up" 
  → Choose: Email or Google
  → If Google: OAuth flow → fetch profile → create account
  → If Email: Fill form → verify email → create account
  → Redirect to Dashboard
Flow 2: Add Contact
Dashboard → "Add Contact" 
  → Fill form (name required, rest optional)
  → Save
  → System creates contact with user as owner
  → If birthday/anniversary → schedule reminders
  → Show contact page
Flow 3: Log Meeting
Contact Page → "Add Meeting"
  → Select medium, date, add notes
  → Optionally set follow-up date
  → Save
  → Updates last_contacted_at
  → If follow-up date → creates reminder
Flow 4: Receive Notification
System checks daily at midnight (user timezone)
  → Finds due reminders
  → Sends push notification + email
  → User taps notification → opens contact page
  → User can: Call, WhatsApp, mark as done
Flow 5: Quick Communication
Contact Page → Tap WhatsApp icon
  → Opens WhatsApp with prefilled message
  → User sends message
  → Returns to app → prompt "Log this as meeting?"
  → If yes → auto-create meeting entry
Flow 6: Share Contact
Contact Page → "Share"
  → Enter colleague's email
  → Set permission + expiry
  → Save
  → Colleague gets notification
  → Sees contact in "Shared with Me"

6. Tech Stack
Layer	Technology
Frontend	React + TypeScript + Tailwind CSS
PWA	Workbox (service worker) + IndexedDB
Backend	Spring Boot (since you're familiar) OR Node.js/NestJS
Database	MySQL (you have experience) or PostgreSQL
Cache	Redis (for sessions, notification queue)
Auth	JWT + Google OAuth 2.0
Push Notifications	Firebase Cloud Messaging (FCM)
Email	SendGrid / AWS SES
Hosting	AWS / Railway / Render
7. PWA Requirements
Feature	Implementation
Installable	manifest.json + service worker
Offline Access	Cache contacts + meetings in IndexedDB
Offline Actions	Queue create/edit operations
Background Sync	Sync queued actions when online
Push Notifications	FCM integration
Fast Load	Precache critical assets
8. MVP Success Criteria
* [ ] User can signup via email or Google
* [ ] Contacts CRUD works smoothly
* [ ] Meeting logging works with timeline view
* [ ] Reminders trigger on time (push + email)
* [ ] WhatsApp/Email/SMS shortcuts work
* [ ] Dashboard shows meaningful data
* [ ] PWA installs and works offline
* [ ] Basic sharing works between users

9. Future Enhancements
* CSV/vCard contact import
* AI-powered follow-up suggestions
* Voice notes for meetings
* Document attachments
* Calendar integration (Google Calendar sync)
* Custom fields for contacts
* Bulk messaging
* Public API/webhooks

Want me to create the database schema SQL, API endpoints list, or wireframes for any specific module?
