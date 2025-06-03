# DEHV: An IoT-Enabled Digital Companion Mobile Application for Elderly (Ages 55-75), with the Inclusivity of Sensory-Impaired (Central Vision Loss and Mixed Hearing Loss), Individuals Who Are Capable of Using Smartphones

## A React Native App

Open the `App.js` file to start writing some code. You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators. When you're done, click **Save** and share the link!

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo cli](https://docs.expo.dev/get-started/installation/#expo-cli)).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.dev/c/expo-dev-tools/61) or [Discord](https://chat.expo.dev/).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).

# Instructions

## RegistrationScreen
Introduction
This guide will walk you through how to use and validate the functionality of the RegistrationScreen component in our mobile application. This screen allows users to register by entering a phone number, which will then be used to send a verification code (OTP).

Follow the steps below to interact with the screen.

How to Access the Screen
Build and run the mobile application in your development or testing environment.

Navigate to the screen labeled RegistrationScreen. This is typically the first screen shown after launching the app if you're not logged in.

What You Should See
A logo at the top.
A progress indicator (dots and lines showing steps).
A title labeled "Registration".
Instructions below the title explaining what you need.
A phone number input field with the prefix +63 (Philippine format).
A privacy message with a small lock icon and a dismiss (X) button.
A "Send Code" button at the bottom.

Steps to Use the Screen
1. Read the Registration Instructions
   Read the message below the title to understand that only a phone number is needed to register.
2. Dismiss the Privacy Notice (Optional)
   If you don’t want to see the privacy message:
Tap the small "X" icon on the right side of the message to close it.
3. Enter Your Phone Number
   Tap on the phone number input field.
You only need to enter the last 10 digits of your number (excluding +63).
For example, if your number is +639123456789, enter 9123456789.
Important Rules:
Your number must start with 9.
It must be exactly 10 digits.
Letters or symbols are not allowed.
If the number doesn't follow these rules, an error message will appear below the field:
"Phone number must be 10 digits and start with 9."
4. Press the "Send Code" Button
   Once a valid number is entered:
Tap Send Code.
You will be redirected to the OTP screen.
Your phone number will be passed to that screen for verification.
If the number is invalid:
You will remain on the same screen.
The error message will stay visible until the number is corrected.


## OTPScreen
Introduction
This screen is designed to verify your phone number by requiring a 6-digit confirmation code (also called OTP – One-Time Password) that was sent after you entered your phone number during registration.

This guide will walk you through how to use the screen.

When You Will See This Screen
You will be brought to this screen after entering a valid phone number on the previous screen and tapping Send Code. The app will display your number here for confirmation.

What You Should See
A back arrow (top-left) to return and edit your phone number.
The app’s logo and registration progress indicator (3-step dots).
A message showing the phone number you entered, e.g., +63 9123456789.
A message telling you whether the number has been confirmed.
A field to enter the 6-digit confirmation code.
A “Send again” link in case you didn’t receive the code.
A button labeled Confirm or Register, depending on your progress.

How to Use the Screen
1. Check Your Phone Number
Your number is shown near the top of the screen.
If you notice it is incorrect, tap the Edit icon next to it. This will bring you back to the previous screen so you can re-enter the correct number.
2. Enter the Confirmation Code
In the Confirmation code field, type the 6-digit code you received via text message.
The code must:
Be exactly 6 digits.
### Contain only numbers (123456).
3. Review Any Messages
If the field is empty and you try to continue, the app will show:
"Please enter the confirmation code."
If you enter fewer than 6 digits or include letters, the app will show:
"The confirmation code must be exactly 6 digits."
If you enter a wrong code (for testing, any code other than 123456), the app will show:
"Invalid confirmation code."
If you enter the correct code (123456), your number will be confirmed and you'll be taken to the next screen (Profile setup).
4. Confirm the Code
Once you've entered the 6-digit code, press the Confirm button.
If the code is correct:
You will see your number marked as confirmed.
The app will take you to the next step of registration.
5. (Optional): Resend the Code
If you didn’t receive the code, tap the Send again link.
This does not trigger any real message for now, but in a live app it would resend the OTP.


## EmergencyContactsScreen
Introduction
This screen allows you to add one or more emergency contacts to your profile during registration. These contacts are intended to be reached in case of an emergency. Completing this screen is one of the final steps before your profile setup is completed.

When You'll See This Screen
You will be taken to the Emergency Contacts screen after confirming your phone number on the OTP screen.

What You Should See
A back arrow in the top-left corner to return to the previous screen.
The app's logo and a progress indicator (showing 3 completed steps).
A header titled "Emergency Contacts".
A message indicating that this step is part of your profile setup.
At least one empty contact form with:
Contact Name field
Contact Number field (with +63 prefix)
An "+ Add More" button to add additional contacts.
A "Save" button at the bottom to complete registration.
A confirmation modal once your data is successfully saved.

Step-by-Step Instructions
Step 1: Add Contact Details
Each contact form includes two required fields:
Contact Name: Enter the full name of the person you want to add.
Contact Number: Enter a valid Philippine mobile number starting with 9 and exactly 10 digits long.
Example: 9123456789 (the +63 prefix is already provided).
What happens if you leave something blank or enter invalid data:
If the name is empty, an error message will appear:
"Name is required."
If the number is not valid (e.g., too short, doesn't start with 9, or includes letters), you'll see:
"Phone number must be 10 digits and start with 9."
These errors must be fixed before you can save.
Step 2: Add More Contacts (Optional)
Tap the "+ Add More" button to add another contact form.
You can add as many emergency contacts as you like.
Each new contact form must also have a name and a valid number.
Step 3: Save Your Contacts
After filling in all required fields:
Tap the "Save" button.
If any fields are invalid or empty:
You will not be able to proceed.
Errors will be highlighted below the affected fields.
Step 4: Confirmation
If everything is filled out correctly:
A modal (popup window) will appear saying:
"You have successfully registered! Proceeding to the app..."
After a few seconds, you will be automatically taken to the Home screen of the app.



## HomeScreen
Introduction
The Home Screen is the central hub of the application. After successfully registering and entering your emergency contacts, you will be automatically redirected here. From this screen, you can access the main features of the app, including companions, medications, emergency services, and settings.

What You Will See
The app’s logo at the top.
A title labeled "Home".

A grid of four large buttons/icons:
Companion
Medications
Emergency
Settings

Each button includes an icon and a text label and is fully interactive.

How to Use the Screen
1. Navigate to Companion
Tap the Companion button (group icon).
This will take you to the Companion Screen, where you can view or manage trusted individuals who support you.
2. Navigate to Medications
Tap the Medications button (pill icon).
This will open the Medication Screen, where you can view, add, or manage your medications.
3. Navigate to Emergency
Tap the Emergency button (alert icon).
This will bring you to the Emergency Screen, which is meant for quickly accessing emergency actions or contacts.
4. Navigate to Settings
Tap the Settings button (gear icon).
This opens the Settings Screen, where you can update your profile, manage emergency contacts, or change app preferences. 


## SettingsScreen

Introduction
The Settings Screen allows you to manage your personal profile, emergency contacts, and medication records. It also provides access to view your complete account information. This screen is essential for keeping your app details up-to-date and accurate.

What You Will See
A button labeled "Edit Profile"
A button labeled "Edit Emergency Contact"
A button labeled "Edit Medications" with tabs:
Add Medications
Update Medications
Remove Medications
A button labeled "Account" for viewing saved information

Each section includes forms, dropdowns, and interactive elements to help you manage your health data easily.

How to Use the Screen
1. Edit Your Profile
Tap the "Edit Profile" button.
Fill in the fields:
Name (letters only)
Age (numbers only)
Address
Gender (select Male, Female, or Other)
Birthday (select Month, Day, Year)
Contact Number (must start with 09 and have 11 digits)
Tap "Save" to confirm, or fix any field that shows a red error.

2. Manage Emergency Contacts
Tap the "Edit Emergency Contact" button.
Tap "Add Contact" to create a new entry.
Enter both name and phone number.
To remove a contact, tap the trash icon next to it. You must keep at least one.
Tap "Save" to apply changes or "Cancel" to discard.

3. Manage Medications
Tap the "Edit Medications" button and choose a tab:

Add Medications
Fill in Name, Dosage, Quantity.
(Optional) Tap "Take Photo" to capture an image of the medication.

Set Time and Frequency:
Options include Daily, Every Other Day, Weekly, or Customize.
If already taken, tick the checkbox and select the date.
Tap "Add Medication" to save.

Update Medications
Tap the "Update Medications" tab.
Choose a medication to edit.
Make changes and tap "Update Medication".

Remove Medications
Tap the "Remove Medications" tab.
Tap the trash icon next to a medication.
Confirm deletion when prompted.

4. View Account Information
Tap the "Account" button.
Your profile and emergency contact details will be displayed in read-only format.
Tap "Close" to exit the view.

