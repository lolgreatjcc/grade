const z = require('zod');
const { zodTextFormat } = require('openai/helpers/zod');

// This file contains all designed prompts that get sent to OpenAI.
// Each prompt segment is designed to have zod formatting of the expected response on top 
// and a function which returns the actual prompt below. 


const question = z.object({
  questionNumber: z.string(),
  questionText: z.string(),
  userAnswer: z.string(),
  correctAnswer: z.string(),
  userCorrectness: z.boolean(),
  keyIdea: z.string(),
  whereUserWentWrong: z.string(),
  questionPage: z.int(),
  questionType: z.int()
})
const splitQuestionsDataFormat = z.object({
  questions: z.array(question)
})

const splitQuestionsPromptDual = (answerSheetfileID, answerKeyFileID) => {
  return {
    prompt: {
      "id": process.env.DUAL_FILE_PROMPT_ID || "pmpt_6a198519f7108190a900e5d91ea72dcc07c01073f8a1c16b",
      "version": process.env.DUAL_FILE_PROMPT_VERSION || "8"
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

const splitQuestionsPromptTriple = (answerSheetfileID, answerKeyFileID, questionPaperFileID) => {
  return {
    prompt: {
      "id": process.env.TRIPLE_FILE_PROMPT_ID || "pmpt_6a198519f7108190a900e5d91ea72dcc07c01073f8a1c16b",
      "version": process.env.TRIPLE_FILE_PROMPT_VERSION || "9"
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
          },
          {
            "type": "input_file",
            "file_id": questionPaperFileID,
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
  // uuid: z.string(),
  // questionNumber: z.string(),
  top_left_coordinate: z.array(z.int()),
  bottom_right_coordinate: z.array(z.int())
})

const findBoundariesFormat = z.object({
  questions: z.array(simpleQuestionFormat)
})

const findBoundaries = (base64Image, questionData) => {
  return {
    prompt: {
      "id": "pmpt_6a2954b24638819488c9d205eeff9cec08452551eb30dbf9",
      "version": "5"
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

const findQuestionNumbersFormat = z.object({
  multipleChoice: z.int(),
  freeResponse: z.int()
})

const findQuestionNumbers = (qnSheetFileID) => {
  return {
    prompt: {
      "id": "pmpt_6a3e18368e108194b79b715977164a2e054958cb05a487d8",
      "version": "1"
    },
    input: [{
      "role": "user",
      "content": [
        {
          "type": "input_file",
          "file_id": qnSheetFileID,
        }
      ]
    }],
    reasoning: {
      "summary": "concise"
    },
    store: true,
    include: [
      "reasoning.encrypted_content",
      "web_search_call.action.sources"
    ],
    text: {
      format: zodTextFormat(findQuestionNumbersFormat, 'find_question_numbers')
    }
  }
}



module.exports = {
  splitQuestionsPromptDual: splitQuestionsPromptDual,
  splitQuestionsPromptTriple: splitQuestionsPromptTriple,
  findBoundaries: findBoundaries,
  findQuestionNumbers: findQuestionNumbers
}