Here’s a cleaner README-ready version:

````md
# Converting Shift Action Pages to Modals

## Overview

The `MyShiftsSchedule` page has been updated so that shift action forms open as modals instead of navigating to separate pages.

Previously, actions such as Mileage and Expense used route-based pages. Those pages depended on `useRouter`, URL query parameters, and `sessionStorage` to identify the selected shift.

The new approach keeps the user on the schedule page and opens the relevant form inside a modal. The selected shift data is passed directly from `MyShiftsSchedule` into the modal component.

This improves the user experience and makes the flow more predictable because staff can complete actions without leaving the schedule screen.

---

## Files Changed

### Parent Page

```txt
pages/myshiftsschedule.js
````

This is the main schedule page where staff select a shift and open available shift actions.

The page already supported modal behavior for:

```txt
CreateUpdateServiceStaffNotesModal
CreateUpdateIncidentReportModal
```

The same modal pattern has now been applied to:

```txt
CreateUpdateServiceMileageModal
CreateUpdateServiceExpenseModal
```

---

## Modal Components

All shift action modal components are located in:

```txt
components/modal/
```

Current modal files:

```txt
components/modal/CreateUpdateServiceStaffNotesModal.jsx
components/modal/CreateUpdateIncidentReportModal.jsx
components/modal/CreateUpdateServiceMileageModal.jsx
components/modal/CreateUpdateServiceExpenseModal.jsx
```

Newly converted modal files:

```txt
components/modal/CreateUpdateServiceMileageModal.jsx
components/modal/CreateUpdateServiceExpenseModal.jsx
```

---

## Pages Replaced by Modals

### Mileage

Old route-based page:

```txt
pages/createUpdateServiceMileage.js
```

New modal component:

```txt
components/modal/CreateUpdateServiceMileageModal.jsx
```

Previously, the Mileage page depended on:

```jsx
useRouter()
sessionStorage.getItem("currentClientBookingId")
router.query.scheduleId
router.query.clientBookingId
router.push("/myshiftsschedule")
router.back()
```

The modal version now receives the selected shift booking ID directly from `MyShiftsSchedule`:

```jsx
<CreateUpdateServiceMileageModal
  user={user}
  clientBookingId={selectedShift.clientBookingId?.toString()}
  onClose={() => setShowMileageModal(false)}
  onSaved={() => {
    setShowMileageModal(false);
    fetchSchedule();
  }}
/>
```

The Mileage modal no longer needs:

```jsx
useRouter()
sessionStorage
router.push()
router.back()
```

It now depends on:

```jsx
clientBookingId
onClose
onSaved
```

---

### Expense

Old route-based page:

```txt
pages/createUpdateServiceExpense.js
```

New modal component:

```txt
components/modal/CreateUpdateServiceExpenseModal.jsx
```

Previously, the Expense page depended on:

```jsx
useRouter()
sessionStorage.getItem("currentClientBookingId")
router.query.scheduleId
router.query.clientBookingId
router.back()
```

The modal version now receives the selected shift booking ID directly from `MyShiftsSchedule`:

```jsx
<CreateUpdateServiceExpenseModal
  user={user}
  clientBookingId={selectedShift.clientBookingId?.toString()}
  onClose={() => setShowExpenseModal(false)}
  onSaved={() => {
    setShowExpenseModal(false);
    fetchSchedule();
  }}
/>
```

The Expense modal no longer depends on route navigation or session storage.

---

## Changes in `MyShiftsSchedule`

### 1. Added Modal Imports

```jsx
import CreateUpdateServiceMileageModal from "../components/modal/CreateUpdateServiceMileageModal";
import CreateUpdateServiceExpenseModal from "../components/modal/CreateUpdateServiceExpenseModal";
```

Existing modal imports:

```jsx
import CreateUpdateServiceStaffNotesModal from "../components/modal/CreateUpdateServiceStaffNotesModal";
import CreateUpdateIncidentReportModal from "../components/modal/CreateUpdateIncidentReportModal";
```

---

### 2. Added Modal State

```jsx
const [showMileageModal, setShowMileageModal] = useState(false);
const [showExpenseModal, setShowExpenseModal] = useState(false);
```

Existing modal state:

```jsx
const [showNotesModal, setShowNotesModal] = useState(false);
const [showIncidentModal, setShowIncidentModal] = useState(false);
```

---

### 3. Updated Mileage Button

Before:

```jsx
<button
  disabled={!selectedShift}
  onClick={() => navigateTo("/createUpdateServiceMileage")}
  className={`${menuBtnClass(!!selectedShift)} hover:text-indigo-700 hover:bg-indigo-50`}
>
  <Car size={18} /> Add Mileage
</button>
```

After:

```jsx
<button
  disabled={!selectedShift}
  onClick={() => {
    setShowNotesModal(false);
    setShowIncidentModal(false);
    setShowExpenseModal(false);
    setShowMileageModal(true);
  }}
  className={menuBtnClass(!!selectedShift, showMileageModal)}
>
  <Car size={18} /> Add Mileage
</button>
```

---

### 4. Updated Expense Button

Before:

```jsx
<button
  disabled={!selectedShift}
  onClick={() => navigateTo("/createUpdateServiceExpense")}
  className={`${menuBtnClass(!!selectedShift)} hover:text-teal-700 hover:bg-teal-50`}
>
  <Receipt size={18} /> Add Expense
</button>
```

After:

```jsx
<button
  disabled={!selectedShift}
  onClick={() => {
    setShowNotesModal(false);
    setShowIncidentModal(false);
    setShowMileageModal(false);
    setShowExpenseModal(true);
  }}
  className={menuBtnClass(!!selectedShift, showExpenseModal)}
>
  <Receipt size={18} /> Add Expense
</button>
```

---

## Modal Rendering Pattern

All shift action modals are rendered inside the schedule content area.

```jsx
{showSomeModal && selectedShift && (
  <div className="absolute inset-0 z-50 flex items-start justify-center bg-black/10 p-8">
    <div className="relative w-full max-w-5xl max-h-[calc(100vh-6rem)] overflow-y-auto bg-white rounded-2xl shadow-2xl">
      <ModalComponent
        user={user}
        clientBookingId={selectedShift.clientBookingId?.toString()}
        onClose={() => setShowSomeModal(false)}
        onSaved={() => {
          setShowSomeModal(false);
          fetchSchedule();
        }}
      />
    </div>
  </div>
)}
```

Recommended modal widths:

```txt
Expense: max-w-2xl
Notes: max-w-5xl
Incident: max-w-5xl
Mileage: max-w-5xl
```

---

## Props Used by the Modals

Each modal receives the following props:

```jsx
user
clientBookingId
onClose
onSaved
```

### `user`

Used to access authenticated user values such as:

```jsx
user.companyId
user.employeeId
```

### `clientBookingId`

Used to fetch and save the record for the selected shift.

### `onClose`

Called when the user cancels or closes the modal.

```jsx
onClose={() => setShowExpenseModal(false)}
```

### `onSaved`

Called after the form is saved successfully.

```jsx
onSaved={() => {
  setShowExpenseModal(false);
  fetchSchedule();
}}
```

---

## Why This Change Was Made

The old route-based approach had a few weaknesses:

```txt
1. Users were taken away from the schedule page.
2. Selected shift data depended on sessionStorage or URL query values.
3. Missing route state could prevent the form from loading.
4. Save and cancel behavior depended on browser navigation.
5. Notes and Incident already used modals, creating an inconsistent user experience.
```

The new modal-based approach is better because:

```txt
1. Users stay on MyShiftsSchedule.
2. Selected shift data is passed directly into the modal.
3. sessionStorage is no longer required for these shift actions.
4. Save and cancel behavior is controlled by the parent page.
5. The schedule can refresh immediately after saving.
6. All shift actions now follow the same UI pattern.
```

---

## Important Logic Change

Before, the child page controlled navigation:

```jsx
router.back();
router.push("/myshiftsschedule");
```

Now, the parent schedule page controls modal visibility:

```jsx
setShowExpenseModal(false);
fetchSchedule();
```

This is intentional.

A modal should not decide where the application navigates after saving. The parent page opened the modal, so the parent page should also be responsible for closing it and refreshing the schedule.

---

## Current Modal-Based Shift Actions

The following shift actions now use modal behavior:

```txt
Add Notes
Report Incident
Add Mileage
Add Expense
```

Only one modal should be open at a time. Before opening a modal, close the others:

```jsx
setShowNotesModal(false);
setShowIncidentModal(false);
setShowMileageModal(false);
setShowExpenseModal(false);
```

Then open the selected modal:

```jsx
setShowExpenseModal(true);
```

---

## Recommended File Structure

```txt
pages/
  myshiftsschedule.js
  createUpdateServiceMileage.js        // optional legacy page
  createUpdateServiceExpense.js        // optional legacy page

components/
  modal/
    CreateUpdateServiceStaffNotesModal.jsx
    CreateUpdateIncidentReportModal.jsx
    CreateUpdateServiceMileageModal.jsx
    CreateUpdateServiceExpenseModal.jsx
```

---

## Cleanup Recommendation

Once the modal versions are fully tested, the old route-based pages should either be removed or kept only as fallback pages.

Avoid keeping both flows active without a clear reason.

Duplicate UI flows create unnecessary maintenance work and increase the risk of inconsistent behavior.

```
```
