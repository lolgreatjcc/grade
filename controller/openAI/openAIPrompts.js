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
const splitQuestions = z.object({
  questions: z.array(question)
})

const splitQuestionsPrompt = (answerSheetfileID, answerKeyFileID) => {
  return {
    prompt: {
      "id": "pmpt_6a198519f7108190a900e5d91ea72dcc07c01073f8a1c16b",
      "version": "3"
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
      format: zodTextFormat(splitQuestions, 'split_questions')
    }
  }
}


module.exports = {
  splitQuestionsPrompt: splitQuestionsPrompt
}