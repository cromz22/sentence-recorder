# Sentence Recorder

This is a tool to collect read audio given sentences to record.

Json files that contain the sentences should be placed at `backend/data/json/{task_id}.json` with the following format:

```json
[
    {
        "sentenceId": "sample1_sentence1",
        "sentence": "This is sample sentence 1 from sample1.json."
    },
    {
        "sentenceId": "sample1_sentence2",
        "sentence": "This is sample sentence 2 from sample1.json."
    }
]
```

Users can access the web app at `{frontend_url}/task/{task_id}` (e.g., https://localhost:5173/task/sample1), where they can record the audio sentence by sentence, check the audio, and submit the audio of their choosing.

The submitted audio will be saved as `backend/data/audio/{task_id}/{sentenceId}.webm` in the [Opus](https://opus-codec.org/) format.
