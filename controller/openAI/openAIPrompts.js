const splitQuestionsPrompt = (fileName) => {
  return {
    prompt: {
      "id": "pmpt_6a198519f7108190a900e5d91ea72dcc07c01073f8a1c16b",
      "version": "2"
    },
    input: [
      {
        "role": "user",
        "content": [
          {
            "type": "input_file",
            "file_id": fileName,
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
    ]
  }
}


module.exports = {
  splitQuestionsPrompts: splitQuestionsPrompts
}