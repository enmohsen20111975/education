# 📱 API Documentation for Flutter Integration

## 🔗 Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

---

## 📚 Lessons API

### 1. Get All Lessons

```http
GET /api/lessons
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `subjectId` | string | Filter by subject (physics, math, chemistry) |
| `unitSlug` | string | Filter by unit (mechanics, algebra, etc.) |

**Response:**
```json
{
  "lessons": [
    {
      "id": "cmq9yd01l0001nrubv0l3arnm",
      "slug": "motion-intro",
      "titleAr": "مقدمة في الحركة",
      "titleEn": "Introduction to Motion",
      "descriptionAr": "...",
      "descriptionEn": "...",
      "duration": 15,
      "isFree": true,
      "order": 1,
      "unit": {
        "id": "...",
        "nameAr": "الميكانيكا",
        "nameEn": "Mechanics",
        "subject": {
          "id": "...",
          "nameAr": "الفيزياء",
          "nameEn": "Physics",
          "slug": "physics"
        }
      },
      "simulators": [
        {
          "simulator": {
            "slug": "motion",
            "nameAr": "محاكي الحركة",
            "nameEn": "Motion Simulator"
          }
        }
      ]
    }
  ]
}
```

### 2. Get Single Lesson

```http
GET /api/lessons/{id}
```

**Response:**
```json
{
  "lesson": {
    "id": "...",
    "titleAr": "مقدمة في الحركة",
    "titleEn": "Introduction to Motion",
    "introductionAr": "...",
    "introductionEn": "...",
    "summaryAr": "...",
    "summaryEn": "...",
    "duration": 15,
    "isFree": true,
    "unit": { ... },
    "objectives": [
      { "textAr": "...", "textEn": "...", "order": 1 }
    ],
    "concepts": [
      { "termAr": "...", "termEn": "...", "definitionAr": "...", "definitionEn": "..." }
    ],
    "formulas": [
      { "formula": "v = Δx / Δt", "explanationAr": "...", "explanationEn": "..." }
    ],
    "examples": [
      {
        "questionAr": "...",
        "questionEn": "...",
        "solutionAr": "...",
        "solutionEn": "...",
        "stepsAr": "[\"step1\", \"step2\"]",
        "stepsEn": "[\"step1\", \"step2\"]"
      }
    ],
    "simulators": [ ... ],
    "questions": [ ... ]
  }
}
```

---

## 🎓 Subjects API

### Get All Subjects

```http
GET /api/subjects
```

**Response:**
```json
{
  "subjects": [
    {
      "id": "...",
      "slug": "physics",
      "nameAr": "الفيزياء",
      "nameEn": "Physics",
      "icon": "Atom",
      "color": "emerald",
      "units": [
        {
          "id": "...",
          "slug": "mechanics",
          "nameAr": "الميكانيكا",
          "nameEn": "Mechanics",
          "lessons": [ ... ]
        }
      ]
    }
  ]
}
```

---

## 📊 Progress API

### Save Progress

```http
POST /api/progress
Content-Type: application/json

{
  "userId": "user_id_here",
  "lessonId": "lesson_id_here",
  "completed": true,
  "score": 85,
  "timeSpent": 1200
}
```

### Get User Progress

```http
GET /api/progress?userId={userId}
```

**Response:**
```json
{
  "progress": [
    {
      "userId": "...",
      "lessonId": "...",
      "completed": true,
      "score": 85,
      "timeSpent": 1200,
      "lesson": {
        "titleAr": "...",
        "titleEn": "...",
        "unit": { ... }
      }
    }
  ],
  "stats": {
    "completedLessons": 5,
    "totalScore": 425,
    "totalTimeSpent": 3600,
    "totalLessons": 41
  }
}
```

---

## 🔬 Simulators API

### Get All Simulators

```http
GET /api/simulators
```

**Response:**
```json
{
  "simulators": [
    {
      "id": "...",
      "slug": "motion",
      "nameAr": "محاكي الحركة",
      "nameEn": "Motion Simulator",
      "type": "physics",
      "lessons": [ ... ]
    }
  ]
}
```

---

## 📱 Flutter Code Examples

### 1. Fetch Lessons

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class LessonService {
  final String baseUrl = 'https://your-domain.com/api';

  Future<List<Lesson>> getLessons({String? subjectId}) async {
    String url = '$baseUrl/lessons';
    if (subjectId != null) {
      url += '?subjectId=$subjectId';
    }

    final response = await http.get(Uri.parse(url));
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return (data['lessons'] as List)
          .map((json) => Lesson.fromJson(json))
          .toList();
    }
    throw Exception('Failed to load lessons');
  }

  Future<Lesson> getLesson(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/lessons/$id'));
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return Lesson.fromJson(data['lesson']);
    }
    throw Exception('Failed to load lesson');
  }
}
```

### 2. Save Progress

```dart
class ProgressService {
  final String baseUrl = 'https://your-domain.com/api';

  Future<void> saveProgress({
    required String userId,
    required String lessonId,
    required bool completed,
    int? score,
    int? timeSpent,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/progress'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'userId': userId,
        'lessonId': lessonId,
        'completed': completed,
        'score': score,
        'timeSpent': timeSpent,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to save progress');
    }
  }
}
```

### 3. Data Models

```dart
class Lesson {
  final String id;
  final String slug;
  final String titleAr;
  final String titleEn;
  final String introductionAr;
  final String introductionEn;
  final String summaryAr;
  final String summaryEn;
  final int duration;
  final bool isFree;
  final Unit unit;
  final List<Objective> objectives;
  final List<Concept> concepts;
  final List<Formula> formulas;
  final List<Example> examples;
  final List<Simulator> simulators;

  Lesson({
    required this.id,
    required this.slug,
    required this.titleAr,
    required this.titleEn,
    required this.introductionAr,
    required this.introductionEn,
    required this.summaryAr,
    required this.summaryEn,
    required this.duration,
    required this.isFree,
    required this.unit,
    required this.objectives,
    required this.concepts,
    required this.formulas,
    required this.examples,
    required this.simulators,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: json['id'],
      slug: json['slug'],
      titleAr: json['titleAr'],
      titleEn: json['titleEn'],
      introductionAr: json['introductionAr'],
      introductionEn: json['introductionEn'],
      summaryAr: json['summaryAr'],
      summaryEn: json['summaryEn'],
      duration: json['duration'],
      isFree: json['isFree'],
      unit: Unit.fromJson(json['unit']),
      objectives: (json['objectives'] as List)
          .map((e) => Objective.fromJson(e))
          .toList(),
      concepts: (json['concepts'] as List)
          .map((e) => Concept.fromJson(e))
          .toList(),
      formulas: (json['formulas'] as List)
          .map((e) => Formula.fromJson(e))
          .toList(),
      examples: (json['examples'] as List)
          .map((e) => Example.fromJson(e))
          .toList(),
      simulators: (json['simulators'] as List)
          .map((e) => Simulator.fromJson(e['simulator']))
          .toList(),
    );
  }
}

class Objective {
  final String textAr;
  final String textEn;
  final int order;

  Objective({required this.textAr, required this.textEn, required this.order});

  factory Objective.fromJson(Map<String, dynamic> json) {
    return Objective(
      textAr: json['textAr'],
      textEn: json['textEn'],
      order: json['order'],
    );
  }
}

class Concept {
  final String termAr;
  final String termEn;
  final String definitionAr;
  final String definitionEn;

  Concept({
    required this.termAr,
    required this.termEn,
    required this.definitionAr,
    required this.definitionEn,
  });

  factory Concept.fromJson(Map<String, dynamic> json) {
    return Concept(
      termAr: json['termAr'],
      termEn: json['termEn'],
      definitionAr: json['definitionAr'],
      definitionEn: json['definitionEn'],
    );
  }
}

class Formula {
  final String formula;
  final String explanationAr;
  final String explanationEn;

  Formula({
    required this.formula,
    required this.explanationAr,
    required this.explanationEn,
  });

  factory Formula.fromJson(Map<String, dynamic> json) {
    return Formula(
      formula: json['formula'],
      explanationAr: json['explanationAr'],
      explanationEn: json['explanationEn'],
    );
  }
}

class Example {
  final String questionAr;
  final String questionEn;
  final String solutionAr;
  final String solutionEn;
  final List<String> stepsAr;
  final List<String> stepsEn;

  Example({
    required this.questionAr,
    required this.questionEn,
    required this.solutionAr,
    required this.solutionEn,
    required this.stepsAr,
    required this.stepsEn,
  });

  factory Example.fromJson(Map<String, dynamic> json) {
    return Example(
      questionAr: json['questionAr'],
      questionEn: json['questionEn'],
      solutionAr: json['solutionAr'],
      solutionEn: json['solutionEn'],
      stepsAr: List<String>.from(jsonDecode(json['stepsAr'])),
      stepsEn: List<String>.from(jsonDecode(json['stepsEn'])),
    );
  }
}
```

---

## 🔐 Authentication (Future)

For production, add authentication headers:

```dart
final response = await http.get(
  Uri.parse(url),
  headers: {
    'Authorization': 'Bearer $token',
    'Content-Type': 'application/json',
  },
);
```

---

## 📋 API Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/subjects` | GET | Get all subjects with units |
| `/api/lessons` | GET | Get all lessons |
| `/api/lessons?id={id}` | GET | Get single lesson |
| `/api/simulators` | GET | Get all simulators |
| `/api/progress` | POST | Save user progress |
| `/api/progress?userId={id}` | GET | Get user progress |

---

## 🚀 Ready for Flutter!

The API is now fully functional and ready to be consumed by a Flutter mobile app. All endpoints return JSON data that can be easily parsed and displayed in your Flutter widgets.
