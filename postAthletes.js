import fetch from 'node-fetch';

async function postAthletes() {
    const athletes = [
        {
          name: "Yvonne Colson",
          email: "yvonne.colson@example.com",
          image: "/yvonne.jpg",
          age: 20,
          sport: "Women's Track & Field (Thrower)",
          major: "Electrical and Computer Engineering",
          gender: "Female",
          ethnicity: "Asian",
          introBlurb: "Student-athlete passionate about sustainability, strength training, and sharing my biracial heritage while balancing academics and athletics.",
          instagram: "yvonne_throws",
          tiktok: "",
          pinterest: "",
          linkedIn: "",
          twitter: "",
          industries: ["Sports", "Sustainability", "STEM", "Fitness & Strength Training"],
          marketingOptions: ["SocialMediaPosts"],
          hoursPerWeek: 12,
          compensation: ["FixedFee", "InKind", "Commission"],
        },
        {
          name: "Leo Daschbach",
          email: "leo.daschbach@example.com",
          image: "/leo.jpg",
          age: 21,
          sport: "Men's Track & Field (Distance)",
          major: "Education",
          gender: "Male",
          ethnicity: "Caucasian",
          introBlurb: "Elite distance runner with a passion for education and inspiring the next generation of athletes.",
          instagram: "leo_daschbach",
          tiktok: "",
          pinterest: "",
          linkedIn: "",
          twitter: "",
          industries: ["Sports", "Education", "Endurance Training"],
          marketingOptions: ["SocialMediaPosts"],
          hoursPerWeek: 15,
          compensation: ["FixedFee", "InKind", "Commission"],
        },
        {
          name: "Moa Segerholt",
          email: "moa.segerholt@example.com",
          image: "/moa.jpg",
          age: 22,
          sport: "Women's Track & Field (Sprints)",
          major: "Law and Journalism",
          gender: "Female",
          ethnicity: "White",
          introBlurb: "Sprinter with a passion for law, journalism, and global storytelling. Fluent in multiple languages and dedicated to making an impact on and off the track.",
          instagram: "moasegerholt",
          tiktok: "",
          pinterest: "",
          linkedIn: "",
          twitter: "",
          industries: ["Sports", "Law", "Media & Journalism"],
          marketingOptions: ["SocialMediaPosts", "InPersonAppearances"],
          hoursPerWeek: 12,
          compensation: ["FixedFee", "InKind", "Commission"],
        },
        { name: "Lana Navarro",
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
        },
        {
          name: "Kelsey Branson",
          email: "kelsey.branson@example.com",
          image: "/kelsey.jpg",
          age: 21,
          sport: "Women's Soccer (Midfielder)",
          major: "Business",
          gender: "Female",
          ethnicity: "Caucasian",
          introBlurb: "Versatile midfielder with a strong tactical mindset and leadership skills on and off the field.",
          instagram: "kelseybranson",
          tiktok: "",
          pinterest: "",
          linkedIn: "",
          twitter: "",
          industries: ["Sports", "Sustainability", "Fashion"],
          marketingOptions: ["SocialMediaPosts", "InPersonAppearances"],
          hoursPerWeek: 14,
          compensation: ["FixedFee", "InKind", "Commission"],
        },
        {
          name: "Samiah Shell",
          email: "samiah.shell@example.com",
          image: "/samiah.jpg",
          age: 18,
          sport: "Women's Soccer (Forward, Midfielder)",
          major: "Undeclared",
          gender: "Female",
          ethnicity: "Asian",
          introBlurb: "Freshman midfielder at UW, passionate about advocacy, culture, and making a difference on and off the field.",
          instagram: "samiahshell",
          tiktok: "",
          pinterest: "",
          linkedIn: "",
          twitter: "",
          industries: ["Sports", "Advocacy", "Food", "Outdoor & Adventure"],
          marketingOptions: ["SocialMediaPosts", "InPersonAppearances"],
          hoursPerWeek: 10,
          compensation: ["FixedFee", "InKind", "Commission"],
        },
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
