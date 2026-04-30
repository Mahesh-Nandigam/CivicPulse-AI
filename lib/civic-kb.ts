export const CIVIC_KNOWLEDGE_BASE = {
  general_info: {
    eligibility: "To vote in India, you must be a citizen of India, 18 years of age or older as of the qualifying date (usually Jan 1st of the year), and a resident of the polling area where you want to be enrolled.",
    registration_portal: "https://voters.eci.gov.in (National Voters' Service Portal)",
    registration_form: "Form 6 is for new registration of voters.",
    voter_id_correction: "Form 8 is used for correction of entries in the existing electoral roll.",
    required_documents: ["Age proof (Birth Certificate, Marksheet, etc.)", "Address proof (Aadhar Card, Electricity Bill, Gas connection, etc.)", "Passport size photograph"],
  },
  states: {
    "Telangana": {
      ceo_portal: "https://ceotelangana.nic.in",
      helpdesk: "1950",
      voter_count: "~3.06 Crore",
    },
    "Maharashtra": {
      ceo_portal: "https://ceo.maharashtra.gov.in",
      helpdesk: "1950",
    },
    // Add more states as needed
  },
  processes: {
    how_to_vote: [
      "First Polling Officer checks your name on the electoral roll and ID proof.",
      "Second Polling Officer will ink your finger, give you a slip, and take your signature on a register (Form 17A).",
      "Third Polling Officer will take the slip and check the mark on your finger.",
      "In the voting compartment, press the button next to the candidate/symbol of your choice on the Electronic Voting Machine (EVM).",
      "Verify the slip from the VVPAT machine. The slip containing the candidate serial no., name, and symbol shall be visible for 7 seconds."
    ],
    registration_steps: [
      "Visit voters.eci.gov.in or download Voter Helpline App.",
      "Register using your mobile number.",
      "Fill Form 6 for New Voter Registration.",
      "Upload required documents (ID proof, Address proof, Photo).",
      "Submit and track your application using the reference ID."
    ]
  },
  deadlines: {
    general_election_2024: {
      phase_1: "April 19",
      phase_2: "April 26",
      phase_3: "May 7",
      phase_4: "May 13",
      phase_5: "May 20",
      phase_6: "May 25",
      phase_7: "June 1",
      results: "June 4"
    }
  }
};
