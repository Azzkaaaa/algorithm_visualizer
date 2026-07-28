export type AlgorithmPreset = {
    id: string;
    name: string;
    description: string;
    code: string;
    functionName: string;
    argsText: string;
}

export const ALGORITHM_PRESETS: AlgorithmPreset[] = [
  {
    id: "two-sum",
    name: "Two Sum",
    description: "Mencari dua angka yang jumlahnya sama dengan target.",
    functionName: "two_sum",
    code: `def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []`,
    argsText: `[
  [2, 7, 11, 15],
  9
]`,
  },
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    description: "Mengurutkan array menggunakan perbandingan elemen bersebelahan.",
    functionName: "bubble_sort",
    code: `def bubble_sort(nums):
    n = len(nums)

    for i in range(n):
        for j in range(n - i - 1):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]

    return nums`,
    argsText: `[
  [5, 2, 8, 1, 3]
]`,
  },
  {
    id: "binary-search",
    name: "Binary Search",
    description: "Mencari target pada array terurut.",
    functionName: "binary_search",
    code: `def binary_search(nums, target):
    left = 0
    right = len(nums) - 1

    while left <= right:
        middle = (left + right) // 2

        if nums[middle] == target:
            return middle

        if nums[middle] < target:
            left = middle + 1
        else:
            right = middle - 1

    return -1`,
    argsText: `[
  [1, 3, 5, 7, 9, 11],
  9
]`,
  },
  {
    id: "valid-parentheses",
    name: "Valid Parentheses",
    description: "Memeriksa apakah pasangan kurung valid menggunakan stack.",
    functionName: "is_valid",
    code: `def is_valid(text):
    stack = []
    pairs = {
        ")": "(",
        "]": "[",
        "}": "{",
    }

    for character in text:
        if character in "([{":
            stack.append(character)
        elif character in pairs:
            if not stack or stack[-1] != pairs[character]:
                return False

            stack.pop()

    return len(stack) == 0`,
    argsText: `[
  "({[]})"
]`,
  },
  {
    id: "factorial",
    name: "Factorial Recursive",
    description:
      "Menghitung faktorial menggunakan pemanggilan function rekursif.",
    functionName: "factorial",
    code: `def factorial(n):
      if n <= 1:
          return 1

      return n * factorial(n - 1)`,
    argsText: `[
    5
]`,
  },
];