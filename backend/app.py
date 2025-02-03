from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simulando um banco de dados com uma lista
tasks = []

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({"error": "Título é obrigatório!"}), 400
    
    new_task = {
        "id": len(tasks) + 1,
        "title": data['title'],
        "completed": False
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    if task_id < len(tasks):
        tasks[task_id]['title'] = request.json.get('title', tasks[task_id]['title'])
        return jsonify({"message": "Tarefa atualizada com sucesso!"}), 200
    return jsonify({"error": "Tarefa não encontrada!"}), 404

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    if task_id < len(tasks):
        deleted_task = tasks.pop(task_id)
        return jsonify(deleted_task), 200
    return jsonify({"error": "Tarefa não encontrada!"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)