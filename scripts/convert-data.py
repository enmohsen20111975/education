#!/usr/bin/env python3
"""
Convert external TypeScript data files to Markdown lesson files
"""

import re
import os
import json

def extract_lessons_from_ts(file_path):
    """Extract lesson data from TypeScript file using regex"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lessons = []
    
    # Find all lesson objects
    # Pattern to match lesson blocks
    lesson_pattern = r'id:\s*[\'"]([^\'"]+)[\'"]\s*,\s*title:\s*[\'"]([^\'"]+)[\'"]'
    
    # More complex extraction
    # Find title, subtitle, analogy, coreConcept, deepExplanation, questions
    
    return lessons

def parse_grade10():
    """Parse grade10.ts file"""
    file_path = '/home/z/Gemini-education-version/lib/data/grade10.ts'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract subject data
    subjects = []
    
    # Find all subject blocks
    subject_pattern = r"id:\s*'(g10_\w+)'.*?name:\s*'([^']+)'"
    subject_matches = re.findall(subject_pattern, content, re.DOTALL)
    
    print(f"Found {len(subject_matches)} subjects in grade10:")
    for match in subject_matches:
        print(f"  - {match[0]}: {match[1]}")
    
    return subject_matches

def parse_all_grades():
    """Parse all grade files"""
    print("=" * 50)
    print("Parsing Grade 10")
    print("=" * 50)
    parse_grade10()
    
    print("\n" + "=" * 50)
    print("Parsing Grade 11")
    print("=" * 50)
    
    file_path = '/home/z/Gemini-education-version/lib/data/grade11.ts'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    subject_pattern = r"id:\s*'(g11_\w+)'.*?name:\s*'([^']+)'"
    subject_matches = re.findall(subject_pattern, content, re.DOTALL)
    print(f"Found {len(subject_matches)} subjects in grade11:")
    for match in subject_matches:
        print(f"  - {match[0]}: {match[1]}")
    
    print("\n" + "=" * 50)
    print("Parsing Grade 12")
    print("=" * 50)
    
    file_path = '/home/z/Gemini-education-version/lib/data/grade12.ts'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    subject_pattern = r"id:\s*'(g12_\w+)'.*?name:\s*'([^']+)'"
    subject_matches = re.findall(subject_pattern, content, re.DOTALL)
    print(f"Found {len(subject_matches)} subjects in grade12:")
    for match in subject_matches:
        print(f"  - {match[0]}: {match[1]}")

if __name__ == '__main__':
    parse_all_grades()
