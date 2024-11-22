from flask import Flask, jsonify, request
from flask_cors import CORS

# Criar a instância do Flask
app = Flask(__name__)

# Permitir CORS para todas as origens
CORS(app)

# Lista de tarefas (para fins de exemplo, uma lista em memória)
tasks = [
    {"id": 1, "task": "Estudar Python"},
    {"id": 2, "task": "Revisar Docker"},
    {"id": 3, "task": "Ler documentação Flask"}
]

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Visualizar todas as tarefas"""
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    """Adicionar uma nova tarefa"""
    data = request.get_json()
    if 'task' not in data:
        return jsonify({"error": "Tarefa é obrigatória"}), 400
    new_task = {
        "id": len(tasks) + 1,  # ID gerado automaticamente
        "task": data['task']
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Editar uma tarefa existente"""
    data = request.get_json()
    task = next((t for t in tasks if t['id'] == task_id), None)
    
    if task is None:
        return jsonify({"error": "Tarefa não encontrada"}), 404
    
    if 'task' in data:
        task['task'] = data['task']
        return jsonify(task)
    
    return jsonify({"error": "Dados incompletos"}), 400

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Excluir uma tarefa"""
    global tasks
    tasks = [t for t in tasks if t['id'] != task_id]
    return jsonify({"message": "Tarefa excluída com sucesso"}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
