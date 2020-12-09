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
    let goldBag; // Our bag object for use in part 2

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
        if (bag === 'shiny gold') {
          goldBag = items[bag];
        }
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
      let allOptions = all;
      allOptions = allOptions.length > 0 ? allOptions.concat(targets) : targets;
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
        let finalBags = []
        for (let bag of allOptions) {
          if (!finalBags.includes(bag)) {
            finalBags.push(bag)
          }
        }
        return finalBags;
      } else {
        return examineBag(allBags, newTargets, allOptions);
      }
    };

    const output = examineBag(allBagObjs, directBags, []);
    console.log(output.length);

    // --- Part Two ---
    // It's getting pretty expensive to fly these days - not because of ticket prices, but because of the ridiculous number of bags you need to buy!

    // Consider again your shiny gold bag and the rules from the above example:

    // faded blue bags contain 0 other bags.
    // dotted black bags contain 0 other bags.
    // vibrant plum bags contain 11 other bags: 5 faded blue bags and 6 dotted black bags.
    // dark olive bags contain 7 other bags: 3 faded blue bags and 4 dotted black bags.
    // So, a single shiny gold bag must contain 1 dark olive bag (and the 7 bags within it) plus 2 vibrant plum bags (and the 11 bags within each of those): 1 + 1*7 + 2 + 2*11 = 32 bags!

    // Of course, the actual rules have a small chance of going several levels deeper than this example; be sure to count all of the bags, even if the nesting becomes topologically impractical!

    // Here's another example:

    // shiny gold bags contain 2 dark red bags.
    // dark red bags contain 2 dark orange bags.
    // dark orange bags contain 2 dark yellow bags.
    // dark yellow bags contain 2 dark green bags.
    // dark green bags contain 2 dark blue bags.
    // dark blue bags contain 2 dark violet bags.
    // dark violet bags contain no other bags.
    // In this example, a single shiny gold bag must contain 126 other bags.

    // How many individual bags are required inside your single shiny gold bag?

    const examineGoldBag = (allBags, targetBags, multipliers, count) => {
      const targets = [];
      const newMultipliers = [];
      // console.log('MULTIPLIER')
      // console.log(multipliers)
      // console.log('TARGET BAGSSSSS')
      let currentCount = Number(count);



      for (let i = 0; i < targetBags.length; i++) {

        if (targetBags[i] !== {}) {
          for (let bag in targetBags[i]) {
            console.log(bag)
            // if (!targets.includes(bag)) {
              targets.push(bag);
              currentCount += Number(targetBags[i][bag]) * multipliers[i];
              newMultipliers.push(Number(targetBags[i][bag]));
            // }
          }
        }
      }
      const newTargets = [];
      targets.forEach(target => {
        allBags.forEach(bags => {
          for (let bag in bags) {
            if (bag === target) {
              newTargets.push(bags[bag]);
            }
          }
        });
      });
      if (newTargets.length === 0) {
        return currentCount;
      } else {
        return examineGoldBag(allBags, newTargets, newMultipliers, currentCount);
      }
    };

    console.log(examineGoldBag(allBagObjs, [goldBag], Object.values(goldBag), 0));
  }
});