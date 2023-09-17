import openai
import sys
import os

def generate_summary(transcript):
    system_prompt = "Answer the question based on the pdf text given to u earlier. Keep it concise, crisp and something that even college freshman could understand. "
    # Initialize OpenAI API
    openai.api_key = ''
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= [{"role":"user", "content": system_prompt + transcript}]
    )
    return response.choices[0].message.content.strip()

if __name__ == "__main__":
    transcript_text = sys.argv[1]
    summary_text = generate_summary(transcript_text)
    print(summary_text)
