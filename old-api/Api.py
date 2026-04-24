from google import genai
from flask_cors import CORS
from google.genai import types
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import json, os
load_dotenv()

client = genai.Client(api_key=os.getenv("API_KEY"))
system_prompt = f"""คุณคือผู้เชี่ยวชาญด้าน IT และ คณิตศาสตร์ และ ด้านภาษา

กฎการตอบ:
1. ตอบในรูปแบบ JSON เท่านั้น
2. รูปแบบคือ {{'ข้อที่(ตัวเลขเท่านั้น)': 'คำตอบ'}} เช่น {{"1":"ถูก"}}
3. คำตอบเลือกในโจทร์มีให้เท่านั้น
4. หากไม่มีข้อมูลในความรู้ที่ให้ไป ให้ใช้ความรู้พื้นฐานของคุณตอบ"""

def AskAi(Data, LLMModel):
    response = client.models.generate_content(
        model=LLMModel,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=0.2,
            response_mime_type="application/json"
        ),
        contents=f"จงตอบคำถามทั้งหมดนี้: {Data}"
    )

    return response

app = Flask(__name__)
CORS(app)

@app.route("/api/ai", methods=["POST"])
def ai_endpoint():
    if not request.is_json:
        return jsonify({"error": "JSON required"}), 400

    data = request.get_json()

    if not isinstance(data, list) or not data:
        return jsonify({"error": "Root JSON must be a list"}), 400

    payload = data[0]

    if not isinstance(payload, dict) or "Data" not in payload:
        return jsonify({"error": "Missing Data field"}), 400

    Data_Req = payload["Data"]
    Data_Req_Model = payload["Model"]

    if isinstance(Data_Req, str):
        try:
            Data_Req = json.loads(Data_Req)
        except json.JSONDecodeError:
            return jsonify({"error": "Data is not valid JSON"}), 400

    if not isinstance(Data_Req, list):
        return jsonify({"error": "Data must be a list"}), 400


    Respone_ASKAI = AskAi(Data_Req, Data_Req_Model)
    try:
        encode_json = json.loads(Respone_ASKAI.text)
    except json.JSONDecodeError:
        return jsonify({
            "success": False,
            "error": "AI response is not valid JSON",
            "raw": Respone_ASKAI.text
        }), 500

    return jsonify({
        "success": True,
        "respone": encode_json,
        "LLM-model": Data_Req_Model
    }), 200


if __name__ == "__main__":
    app.run(
        host=os.getenv("HOST"),
        port=os.getenv("PORT"),
        debug=True
    )
