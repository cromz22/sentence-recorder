# Sentence Recorder for Code-switched Sentences

This is a tool to collect read audio given code-switched sentences to record.

Json files that contain the code-switched sentences with monolingual references should be placed at `backend/data/json/{task_id}.json` with the following format:

```json
[
    {
        "sentenceId": "sample1_sentence1",
        "codeSwitchedSentence": "This is sample 文 1 from sample1.json.",
        "reference": "This is sample sentence 1 from sample1.json."
    },
    {
        "sentenceId": "sample1_sentence2",
        "codeSwitchedSentence": "This is sample 文 2 from sample1.json.",
        "reference": "This is sample sentence 2 from sample1.json."
    }
]
```

Users can access the web app at `{frontend_url}/task/{task_id}` (e.g., http://localhost:5173/task/sample1), where they can evaluate the sentences and record the audio.

The audio will be saved as `backend/data/audio/{task_id}/{sentenceId}.webm` in the [Opus](https://opus-codec.org/) format.
The metadata (sentence ID, whether the sentence is actually code-switched, whether the code-switched sentence has the same meaning as the original one, fluency, saved audio file name) will be saved as `backend/data/metadata/{task_id}.json`.
