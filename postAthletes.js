import fetch from 'node-fetch';

async function postAthletes() {
    const athletes = [
        {
          name: "Molly Wilson",
          email: "molly.wilson@example.com",
          image: "/molly.jpg",
          age: 21,
          sport: "Women's Volleyball (Setter)",
          major: "Exercise Science",
          gender: "Female",
          ethnicity: "Caucasian",
          introBlurb: "Passionate setter with a love for the game!",
          instagram: "mollyraewilson",
          tiktok: "",
          pinterest: "",
          linkedIn: "",
          twitter: "",
          industries: ["Sports", "Fitness"],
          marketingOptions: ["SocialMediaPosts", "InPersonAppearances"],
          hoursPerWeek: 10,
          compensation: ["InKind", "Commission"],
        },
        {
          name: "Will Landram",
          email: "will.landram@example.com",
          image: "/will.jpg",
          age: 22,
          sport: "Men's Basketball (Forward, Guard)",
          major: "Business Management",
          gender: "Male",
          ethnicity: "African American",
          introBlurb: "Aggressive on defense, versatile on offense.",
          instagram: "will.landram",
          tiktok: "",
          pinterest: "",
          linkedIn: "",
          twitter: "",
          industries: ["Sports", "Fitness"],
          marketingOptions: ["SocialMediaPosts", "InPersonAppearances"],
          hoursPerWeek: 15,
          compensation: ["InKind", "Commission"],
        },
        {
          name: "Maya Loudd",
          email: "maya.loudd@example.com",
          image: "/maya.jpg",
          age: 20,
          sport: "Women's Soccer (Center Back)",
          major: "Environmental Science",
          gender: "Female",
          ethnicity: "Hispanic",
          introBlurb: "Defender with a tactical mindset.",
          instagram: "maya.loudd",
          tiktok: "",
          pinterest: "",
          linkedIn: "",
          twitter: "",
          industries: ["Sports", "Sustainability"],
          marketingOptions: ["SocialMediaPosts"],
          hoursPerWeek: 12,
          compensation: ["FixedFee"],
        },
        {
          name: "Lana Navarro",
          email: "lana.navarro@example.com",
          image: "/lana.jpg",
          age: 23,
          sport: "Women's Gymnastics (Beam, Floor, Vault)",
          major: "Psychology",
          gender: "Female",
          ethnicity: "Asian",
          introBlurb: "Elite gymnast with a passion for mental health advocacy.",
          instagram: "lanaxnavarro",
          tiktok: "",
          pinterest: "",
          linkedIn: "",
          twitter: "",
          industries: ["Sports", "Mental Health"],
          marketingOptions: ["SocialMediaPosts"],
          hoursPerWeek: 10,
          compensation: ["FixedFee", "InKind"],
        }
      ];
      

  for (const athlete of athletes) {
    try {
      const response = await fetch('http://localhost:3000/api/student-athlete', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(athlete),
      });

      if (!response.ok) {
        console.error(`Failed to post athlete ${athlete.name}: ${response.statusText}`);
      } else {
        const data = await response.json();
        console.log(`Successfully added athlete: ${athlete.name}`, data);
      }
    } catch (error) {
      console.error('Error posting athlete data:', error);
    }
  }
}

postAthletes();
