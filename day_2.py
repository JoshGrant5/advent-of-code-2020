# --- Day 2: Password Philosophy ---
# Your flight departs in a few days from the coastal airport; the easiest way down to the coast from here is via toboggan.

# The shopkeeper at the North Pole Toboggan Rental Shop is having a bad day. "Something's wrong with our computers; we can't log in!" You ask if you can take a look.

# Their password database seems to be a little corrupted: some of the passwords wouldn't have been allowed by the Official Toboggan Corporate Policy that was in effect when they were chosen.

# To try to debug the problem, they have created a list (your puzzle input) of passwords (according to the corrupted database) and the corporate policy when that password was set.

# For example, suppose you have the following list:

# 1-3 a: abcde
# 1-3 b: cdefg
# 2-9 c: ccccccccc
# Each line gives the password policy and then the password. The password policy indicates the lowest and highest number of times a given letter must appear for the password to be valid. For example, 1-3 a means that the password must contain a at least 1 time and at most 3 times.

# In the above example, 2 passwords are valid. The middle password, cdefg, is not; it contains no instances of b, but needs at least 1. The first and third passwords are valid: they contain one a or nine c, both within the limits of their respective policies.

# How many passwords are valid according to their policies?

def validate_password(passwords):
  count = 0

  for item in passwords:
    # Break up each line
    split_password = item.split()

    # Grab the minimum and maximum number of instances for the key letter
    instances = split_password[0]
    split_instances = instances.split('-')
    min_instances = int(split_instances[0])
    max_instances = int(split_instances[1])

    # Grab the key letter and the separated password
    key = split_password[1]
    password = split_password[2]
    
    # Loop through password and count instances of the key letter
    key_count = 0
    i = 0
    while i < len(password):
      if password[i] == key[0]:
        key_count += 1
      i += 1

    if key_count >= min_instances and key_count <= max_instances:
      count += 1

  return count

print(validate_password(passwords))

# The shopkeeper suddenly realizes that he just accidentally explained the password policy rules from his old job at the sled rental place down the street! The Official Toboggan Corporate Policy actually works a little differently.

# Each policy actually describes two positions in the password, where 1 means the first character, 2 means the second character, and so on. (Be careful; Toboggan Corporate Policies have no concept of "index zero"!) Exactly one of these positions must contain the given letter. Other occurrences of the letter are irrelevant for the purposes of policy enforcement.

# Given the same example list from above:

# 1-3 a: abcde is valid: position 1 contains a and position 3 does not.
# 1-3 b: cdefg is invalid: neither position 1 nor position 3 contains b.
# 2-9 c: ccccccccc is invalid: both position 2 and position 9 contain c.

def validate_again(passwords):
  count = 0

  for item in passwords:
    # Break up each line
    split_password = item.split()

    # Grab the first and second locations to check
    instances = split_password[0]
    split_instances = instances.split('-')
    first_instance = int(split_instances[0]) - 1
    second_instance = int(split_instances[1]) - 1

    # Grab the key letter and the separated password
    key = split_password[1]
    password = split_password[2]
    
    # Check if the key is in the first position and NOT in the second or viceversa
    if key[0] == password[first_instance] and key[0] != password[second_instance]:
      count += 1
    elif key[0] != password[first_instance] and key[0] == password[second_instance]:
      count += 1

  return count

print(validate_again(passwords))