# --- Day 5: Binary Boarding ---
# You board your plane only to discover a new problem: you dropped your boarding pass! You aren't sure which seat is yours, and all of the flight attendants are busy with the flood of people that suddenly made it through passport control.

# You write a quick program to use your phone's camera to scan all of the nearby boarding passes (your puzzle input); perhaps you can find your seat through process of elimination.

# Instead of zones or groups, this airline uses binary space partitioning to seat people. A seat might be specified like FBFBBFFRLR, where F means "front", B means "back", L means "left", and R means "right".

# The first 7 characters will either be F or B; these specify exactly one of the 128 rows on the plane (numbered 0 through 127). Each letter tells you which half of a region the given seat is in. Start with the whole list of rows; the first letter indicates whether the seat is in the front (0 through 63) or the back (64 through 127). The next letter indicates which half of that region the seat is in, and so on until you're left with exactly one row.

# For example, consider just the first seven characters of FBFBBFFRLR:

# Start by considering the whole range, rows 0 through 127.
# F means to take the lower half, keeping rows 0 through 63.
# B means to take the upper half, keeping rows 32 through 63.
# F means to take the lower half, keeping rows 32 through 47.
# B means to take the upper half, keeping rows 40 through 47.
# B keeps rows 44 through 47.
# F keeps rows 44 through 45.
# The final F keeps the lower of the two, row 44.
# The last three characters will be either L or R; these specify exactly one of the 8 columns of seats on the plane (numbered 0 through 7). The same process as above proceeds again, this time with only three steps. L means to keep the lower half, while R means to keep the upper half.

# For example, consider just the last 3 characters of FBFBBFFRLR:

# Start by considering the whole range, columns 0 through 7.
# R means to take the upper half, keeping columns 4 through 7.
# L means to take the lower half, keeping columns 4 through 5.
# The final R keeps the upper of the two, column 5.
# So, decoding FBFBBFFRLR reveals that it is the seat at row 44, column 5.

# Every seat also has a unique seat ID: multiply the row by 8, then add the column. In this example, the seat has ID 44 * 8 + 5 = 357.

# Here are some other boarding passes:

# BFFFBBFRRR: row 70, column 7, seat ID 567.
# FFFBBBFRRR: row 14, column 7, seat ID 119.
# BBFFBBFRLL: row 102, column 4, seat ID 820.
# As a sanity check, look through your list of boarding passes. What is the highest seat ID on a boarding pass?

import math

def main():

  row = 0
  column = 0
  highest_id = 0

  with open('./input/day_5.txt') as f:
    content = f.read().splitlines()

  for line in content:
    row_chars = line[0:7]
    column_chars = line[7:]

    # row_chars = content[1][0:7]
    # column_chars = content[1][7:]
    # FIND ROW
    start_point = 0
    end_point = 127
    for num in range(7):
      # Divide the plane into the corresponding rows to search
      half = end_point - start_point
       # split = math.floor(half / 2)

  

      split = math.floor(half / 2)

      print(split)

      # Search the rows based on Front or Back
      if num == 6:
        if row_chars[num] == 'F':
          row = start_point
          print('The row is ' + row_chars[num] + ' and ' + str(start_point) + ' - ' + str(end_point))
          print('Chosen ' + str(start_point))
        elif row_chars[num] == 'B':
          row = end_point
          print('The row is ' + row_chars[num] + ' and ' + str(start_point) + ' - ' + str(end_point))
          print('Chosen ' + str(end_point))
      else:
        if row_chars[num] == 'F':
          end_point -= split + 1
          print('The row is ' + row_chars[num] + ' and ' + str(start_point) + ' - ' + str(end_point))
        elif row_chars[num] == 'B':
          start_point += split + 1
          print('The row is ' + row_chars[num] + ' and ' + str(start_point) + ' - ' + str(end_point))
    # FIND COLUMN
    start_point = 0
    end_point = 7
    for num in range(3):
      # Divide the plane into the corresponding columns to search
      half = end_point - start_point
      split = math.floor(half / 2)

      print('col split is ', str(split))
      # Search the rows based on Front or Back
      if num == 2:
        if column_chars[num] == 'L':
          column = start_point
          print(column_chars[num] + 'chosen ' + str(column))
        elif column_chars[num] == 'R':
          column = end_point
          print(column_chars[num] + 'chosen ' + str(column))
      else:
        if column_chars[num] == 'L':
          end_point -= split + 1
          print('The col is ' + column_chars[num] + ' and ' + str(start_point) + ' - ' + str(end_point))
        elif column_chars[num] == 'R':
          start_point += split + 1
          print('The col is ' + column_chars[num] + ' and ' + str(start_point) + ' - ' + str(end_point))
    # CALCULATE THE UNIQUE ID OF THE SEAT
    unique_id = (row * 8) + column
    # CHECK AGAINST THE HIGHEST ID
    if unique_id > highest_id:
      highest_id = unique_id

  print(highest_id)

if __name__== "__main__":
  main()