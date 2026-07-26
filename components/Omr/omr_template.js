const omr_template = {
    'four': {
        "pageDimensions": [
            1653, 2338
            ],
        "bubbleDimensions": [
            55,
            78
        ],
        "preProcessors": [
            {
            "name": "CropOnMarkers",
            "options": {
                "type": "CUSTOM_MARKER",
                "relativePath": "omr_marker.jpg",
                "sheetToMarkerWidthRatio": 17,
                    "min_matching_threshold": 0.2,
            }
            }
        ],
        "fieldBlocks": {
            "MCQ_Block_1": {
                "fieldType": "QTYPE_MCQ4",
                "origin": [
                126,
                452
                ],
                "fieldLabels": [
                "q1..15"
                ],
                "labelsGap": 96.5,
                "bubblesGap": 58
            },
            "MCQ_Block_2": {
                "fieldType": "QTYPE_MCQ4",
                "origin": [
                477.5,
                452
                ],
                "fieldLabels": [
                "q16..30"
                ],
                "labelsGap": 96.5,
                "bubblesGap": 58
            },
            "MCQ_Block_3": {
                "fieldType": "QTYPE_MCQ4",
                "origin": [
                828,
                452
                ],
                "fieldLabels": [
                "q31..45"
                ],
                "labelsGap": 96.5,
                "bubblesGap": 58
            },
            "MCQ_Block_4": {
                "fieldType": "QTYPE_MCQ4",
                "origin": [
                1176.5,
                452
                ],
                "fieldLabels": [
                "q46..60"
                ],
                "labelsGap": 96.5,
                "bubblesGap": 58
            }
        }
    },
    "five": {
        "pageDimensions": [
            1653, 2338
            ],
        "bubbleDimensions": [
            55,
            78
        ],
        "preProcessors": [
            {
            "name": "CropOnMarkers",
            "options": {
                "type": "CUSTOM_MARKER",
                "relativePath": "omr_marker.jpg",
                "sheetToMarkerWidthRatio": 17,
                    "min_matching_threshold": 0.2,
            }
            }
        ],
        "fieldBlocks": {
            "MCQ_Block_1": {
                "fieldType": "QTYPE_MCQ5",
                "origin": [
                127.5,
                452
                ],
                "fieldLabels": [
                "q1..15"
                ],
                "labelsGap": 96.5,
                "bubblesGap": 58
            },
            "MCQ_Block_2": {
                "fieldType": "QTYPE_MCQ5",
                "origin": [
                534.5,
                452
                ],
                "fieldLabels": [
                "q16..30"
                ],
                "labelsGap": 96.5,
                "bubblesGap": 58
            },
            "MCQ_Block_3": {
                "fieldType": "QTYPE_MCQ5",
                "origin": [
                944,
                452
                ],
                "fieldLabels": [
                "q31..45"
                ],
                "labelsGap": 96.5,
                "bubblesGap": 58
            },
            "MCQ_Block_4": {
                "fieldType": "QTYPE_MCQ5",
                "origin": [
                1353.5,
                452
                ],
                "fieldLabels": [
                "q46..60"
                ],
                "labelsGap": 96.5,
                "bubblesGap": 58
            }
        }
    }
}

module.exports = omr_template;