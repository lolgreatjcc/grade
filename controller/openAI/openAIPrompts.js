const z = require('zod');
const { zodTextFormat } = require('openai/helpers/zod');

const question = z.object({
  questionNumber: z.string(),
  questionText: z.string(),
  userAnswer: z.string(),
  correctAnswer: z.string(),
  userCorrectness: z.boolean(),
  keyIdea: z.string(),
  whereUserWentWrong: z.string(),
  questionPage: z.int(),
})
const splitQuestionsDataFormat = z.object({
  questions: z.array(question)
})


const splitQuestionsPrompt = (answerSheetfileID, answerKeyFileID) => {
  return {
    prompt: {
      "id": "pmpt_6a198519f7108190a900e5d91ea72dcc07c01073f8a1c16b",
      "version": "4"
    },
    input: [
      {
        "role": "user",
        "content": [
          {
            "type": "input_file",
            "file_id": answerSheetfileID,
          },
          {
            "type": "input_file",
            "file_id": answerKeyFileID,
          }
        ]
      }
    ],
    reasoning: {
      "summary": "concise"
    },
    store: true,
    include: [
      "reasoning.encrypted_content",
      "web_search_call.action.sources"
    ],
    text: {
      format: zodTextFormat(splitQuestionsDataFormat, 'split_questions')
    }
  }
}

const simpleQuestionFormat = z.object({
  questionNumber: z.string(),
  startingBoundary: z.array(z.int()),
  endingBoundary: z.array(z.int())
})

const findBoundariesFormat = z.object({
  questions: z.array(simpleQuestionFormat)
})

const findBoundaries = (base64Image, questionData) => {
  return {
    prompt: {
      "id": "pmpt_6a2954b24638819488c9d205eeff9cec08452551eb30dbf9",
      "version": "4"
    },
    input: [
      {
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": JSON.stringify(questionData)
          },
          {
            "type": "input_image",
            "image_url": base64Image
          }
        ]
      },
    ],
    reasoning: {
      "summary": "concise"
    },
    store: true,
    include: [
      "reasoning.encrypted_content",
      "web_search_call.action.sources"
    ],
    text: {
      format: zodTextFormat(findBoundariesFormat, 'find_boundaries')
    }
  }
}

module.exports = {
  splitQuestionsPrompt: splitQuestionsPrompt,
  findBoundaries: findBoundaries
}