// --- Day 7: Handy Haversacks ---
// You land at the regional airport in time for your next flight. In fact, it looks like you'll even have time to grab some food: all flights are currently delayed due to issues in luggage processing.

// Due to recent aviation regulations, many rules (your puzzle input) are being enforced about bags and their contents; bags must be color-coded and must contain specific quantities of other color-coded bags. Apparently, nobody responsible for these regulations considered how long they would take to enforce!

// For example, consider the following rules:

// light red bags contain 1 bright white bag, 2 muted yellow bags.
// dark orange bags contain 3 bright white bags, 4 muted yellow bags.
// bright white bags contain 1 shiny gold bag.
// muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
// shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
// dark olive bags contain 3 faded blue bags, 4 dotted black bags.
// vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
// faded blue bags contain no other bags.
// dotted black bags contain no other bags.

// These rules specify the required contents for 9 bag types. In this example, every faded blue bag is empty, every vibrant plum bag contains 11 bags (5 faded blue and 6 dotted black), and so on.

// You have a shiny gold bag. If you wanted to carry it in at least one other bag, how many different bag colors would be valid for the outermost bag? (In other words: how many colors can, eventually, contain at least one shiny gold bag?)

// In the above rules, the following options would be available to you:

// A bright white bag, which can hold your shiny gold bag directly.
// A muted yellow bag, which can hold your shiny gold bag directly, plus some other bags.
// A dark orange bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
// A light red bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
// So, in this example, the number of bag colors that can eventually contain at least one shiny gold bag is 4.

// How many bag colors can eventually contain at least one shiny gold bag? (The list of rules is quite long; make sure you get all of it.)

const fs = require('fs');

fs.readFile('./input/day_7.txt', 'utf-8', (err, data) => {
  if (err) {
    console.log('Error:', err);
  } else {
    const nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const allBags = []; // Array containing string info for each bag
    const allBagObjs = [];  // Array containing all bag objects
    const directBags = []; // Bags that can hold our shiny gold bag directly

    splitData = data.split('\n');
    
    // Split each description sentence into applicable data to use in bagObj
    splitData.forEach(item => {
      bagData = [];
      a = item.split('contain');
      a.forEach(item => {
        b = item.split(',');
        b.forEach(item => {
          c = item.split('bags');
          c.forEach(item => {
            d = item.split('bag');
            bagData.push(d)
          });
        });
      });
      allBags.push(bagData)
    });
    // Create a bagObj for each item in the allBags array
    allBags.forEach(items => {
      const bagObj = {};
      let bag = items[0][0]; // Access the bag string 
      bag = bag.slice(0, -1); // Remove the trailing space character

      bagObj[bag] = {};
      items.forEach(item => {
        item.forEach(data => {
          let quantity;
          let color;
          for (let i = 0; i < data.length; i++) {
            if (nums.includes(data[i])) {
              quantity = data[i];
              color = data.slice(i + 2, -1);
            }
          }
          if (color) {
            bagObj[bag][color] = quantity;
          }
        });
      });
      allBagObjs.push(bagObj);
    });
    // Search through all of the bag objects to find bags that contain shiny gold
    allBagObjs.forEach(items => {
      for (let bag in items) {
        if (Object.keys(items[bag]).includes('shiny gold')) {
          directBags.push(items);
        }
      }
    });
    // Once we have our starting point with the list of direct bags, use recursion to find any other bag that could contain the direct bags
    const examineBag = (allBags, targetBags, all) => {
      const targets = [];
      targetBags.forEach(bags => {
        for (let bag in bags) {
          if (!targets.includes(bag)) {
            targets.push(bag);
          }
        }
      });
      // console.log('TARGET BAGSSSSSSS')
      // console.log(targets)
      let allOptions = all;
      allOptions = allOptions.length > 0 ? allOptions.concat(targets) : targets;
      // if (allOptions.length > 0) {
      //   // for (const [key, value] of Object.entries(targetBags)) {
      //   for (let key of targets) {
      //     if (!Object.keys(allOptions).includes(key)) {
      //       // console.log(key)
      //       // console.log(targetBags)
      //       // console.log(value)
      //       allOptions.push(key);
      //     }
      //   }
      // } else {
      //   allOptions = targetBags;
      // } 
      // Search through all of the bag objects for bags that contain bags in the targets array
      // console.log('ALL OPTIONSSSS')
      // console.log(allOptions)
      const newTargets = [];
      allBags.forEach(bags => {

        for (let bag in bags) {
         
          targets.forEach(targetBag => {
            if (Object.keys(bags[bag]).includes(targetBag)) {
              if (!Object.keys(newTargets).includes(bag))
              newTargets.push(bags);
            }
          });
        }
      });
   
      if (newTargets.length === 0) {
        return allOptions;
      } else {
        return examineBag(allBags, newTargets, allOptions);
      }
    };

    const finalBags = examineBag(allBagObjs, directBags, []);

    let testBags = []
    for (let bag of finalBags) {
      if (!testBags.includes(bag)) {
        testBags.push(bag)
      }
    }
    console.log(testBags.length);
  }
});