const fs = require('fs');

// Helper functions for Part 2 of Exercise
const validateBirthYear = year => {
  return (Number(year) < 1920 || Number(year) > 2002) ? false : true;
};

const validateIssueYear = year => {
  return (Number(year) < 2010 || Number(year) > 2020) ? false : true;
};

const validateExpirationYear = year => {
  return (Number(year) < 2020 || Number(year) > 2030) ? false : true;
};

const validateHeight = height => {
  const measurement = height.slice(-2);
  const value = height.substring(0, height.length - 2);
  if (measurement === 'in') {
    return (Number(value) < 59 || Number(value) > 76) ? false : true;
  } else if (measurement === 'cm') {
    return (Number(value) < 150 || Number(value) > 193) ? false : true;
  }
  return false;
};

const validateHair = color => {
  const nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let letters = ['a', 'b', 'c', 'd', 'e', 'f'];

  if (color[0] === '#' && color.length === 7) {
    for (let i = 1; i < 7; i++) {
      if (nums.includes(color[i]) && letters.includes(color[i])) {
        return false
      }
    }
  } else {
    return false;
  }
  return true;
};

const validateEyes = color => {
  eyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
  return eyeColors.includes(color) ? true : false;
};

const validateId = id => {
  const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  if (String(id).length === 9) {
    for (let i = 0; i < id.length; i++) {
      if (!nums.includes(String(id[i]))) {
        return false;
      }
    }
    return true
  }
  return false;
};

// --- Day 4: Passport Processing ---
// You arrive at the airport only to realize that you grabbed your North Pole Credentials instead of your passport. While these documents are extremely similar, North Pole Credentials aren't issued by a country and therefore aren't actually valid documentation for travel in most of the world.

// It seems like you're not the only one having problems, though; a very long line has formed for the automatic passport scanners, and the delay could upset your travel itinerary.

// Due to some questionable network security, you realize you might be able to solve both of these problems at the same time.

// The automatic passport scanners are slow because they're having trouble detecting which passports have all required fields. The expected fields are as follows:

// byr (Birth Year)
// iyr (Issue Year)
// eyr (Expiration Year)
// hgt (Height)
// hcl (Hair Color)
// ecl (Eye Color)
// pid (Passport ID)
// cid (Country ID)
// Passport data is validated in batch files (your puzzle input). Each passport is represented as a sequence of key:value pairs separated by spaces or newlines. Passports are separated by blank lines.

// Here is an example batch file containing four passports:

// ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
// byr:1937 iyr:2017 cid:147 hgt:183cm

// iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
// hcl:#cfa07d byr:1929

// hcl:#ae17e1 iyr:2013
// eyr:2024
// ecl:brn pid:760753108 byr:1931
// hgt:179cm

// hcl:#cfa07d eyr:2025 pid:166559648
// iyr:2011 ecl:brn hgt:59in
// The first passport is valid - all eight fields are present. The second passport is invalid - it is missing hgt (the Height field).

// The third passport is interesting; the only missing field is cid, so it looks like data from North Pole Credentials, not a passport at all! Surely, nobody would mind if you made the system temporarily ignore missing cid fields. Treat this "passport" as valid.

// The fourth passport is missing two fields, cid and byr. Missing cid is fine, but missing any other field is not, so this passport is invalid.

// According to the above rules, your improved system would report 2 valid passports.

// Count the number of valid passports - those that have all required fields. Treat cid as optional. In your batch file, how many passports are valid?


const passports = []; // Array of passport objects
let validPassports = [];

fs.readFile('./input/day_4.txt', 'utf-8', (err, data) => {
  if (err) {
    console.log('Error:', err);
  } else {
    splitData = data.split('\n\n'); 
    // Break up data from text file to reorganize each "passport" into an object
    splitData.forEach(data => {
      let passportInfo = []; // Array for storing all data for a single passport once spaces and colons have been removed
      let passportObj = {}; // Passport object created from each passportInfo array
      // For each passport, remove the line breaks that may be present
      let singleLine = data.split('\n');
      // Remove all spaces that may be present
      singleLine.forEach(item => {
        let spacesRemoved = item.split(' ');
        let singleLineData = []; // Placeholder array for storing data once colons are removed
        // Remove all colons that are present
        spacesRemoved.forEach(item => {
          let colonRemoved = item.split(':');
          // Concat into passportInfo to create a single array 
          for (let item of colonRemoved) {
            singleLineData = singleLineData.concat(item);
          }
        });
        passportInfo = passportInfo.concat(singleLineData);
      });
      // Create passportObj for each passportInfo array
      for (let i = 0; i < passportInfo.length; i++) {
        if (i % 2 === 0) {
          passportObj[passportInfo[i]] = passportInfo[i + 1];
        }
      }
      passports.push(passportObj);
    });
    // Iterate through each passport and add to count if valid
    passports.forEach(passport => {
      if (Object.keys(passport).length >= 8) {
        validPassports.push(passport);
      } else if (Object.keys(passport).length === 7 && !Object.keys(passport).includes('cid')) {
        validPassports.push(passport);
      } 
    });

    console.log(validPassports.length);

    // --- Part Two ---
    // The line is moving more quickly now, but you overhear airport security talking about how passports with invalid data are getting through. Better add some data validation, quick!

    // You can continue to ignore the cid field, but each other field has strict rules about what values are valid for automatic validation:

    // byr (Birth Year) - four digits; at least 1920 and at most 2002.
    // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
    // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
    // hgt (Height) - a number followed by either cm or in:
    // If cm, the number must be at least 150 and at most 193.
    // If in, the number must be at least 59 and at most 76.
    // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
    // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
    // pid (Passport ID) - a nine-digit number, including leading zeroes.
    // cid (Country ID) - ignored, missing or not.

    // Count the number of valid passports - those that have all required fields and valid values. Continue to treat cid as optional. In your batch file, how many passports are valid?

    newValidCount = 0;

    validPassports.forEach(passport => {
      let validations = [
        validateBirthYear(passport.byr),
        validateIssueYear(passport.iyr),
        validateExpirationYear(passport.eyr),
        validateHeight(passport.hgt),
        validateHair(passport.hcl),
        validateEyes(passport.ecl),
        validateId(passport.pid)
      ];

      if (!validations.includes(false)) {
        newValidCount++;
      }
    });

    console.log(newValidCount);
  }
});

