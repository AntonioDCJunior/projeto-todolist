from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from models import db, Task
import os


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Caminho do arquivo do banco (dentro da pasta backend)
    db_path = os.path.join(os.path.dirname(__file__), "tasks.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    # Cria as tabelas se não existirem
    with app.app_context():
        db.create_all()

    # --------- ROTAS ---------

    @app.route("/tasks", methods=["GET"])
    def get_tasks():
        """
        Lista tarefas.
        Permite filtro opcional por status:
        - /tasks
        - /tasks?status=pending
        - /tasks?status=done
        """
        status = request.args.get("status")  # all | pending | done

        query = Task.query

        if status == "done":
            query = query.filter_by(completed=True)
        elif status == "pending":
            query = query.filter_by(completed=False)

        tasks = query.order_by(Task.created_at.desc()).all()
        return jsonify([t.to_dict() for t in tasks]), 200

    @app.route("/tasks", methods=["POST"])
    def create_task():
        """
        Cria uma nova tarefa.
        Body JSON: { "title": "Nome da tarefa" }
        """
        data = request.get_json() or {}
        title = (data.get("title") or "").strip()

        if not title:
            return jsonify({"error": "Título é obrigatório!"}), 400

        task = Task(title=title, completed=False)
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201

    @app.route("/tasks/<int:task_id>", methods=["PUT"])
    def update_task(task_id):
        """
        Atualiza uma tarefa.
        Body JSON pode conter:
        - "title": novo título
        - "completed": true/false
        """
        task = Task.query.get(task_id)
        if not task:
            abort(404)

        data = request.get_json() or {}

        if "title" in data:
            new_title = (data["title"] or "").strip()
            if not new_title:
                return jsonify({"error": "Título não pode ser vazio!"}), 400
            task.title = new_title

        if "completed" in data:
            task.completed = bool(data["completed"])

        db.session.commit()
        return jsonify(task.to_dict()), 200

    @app.route("/tasks/<int:task_id>", methods=["DELETE"])
    def delete_task(task_id):
        """
        Deleta uma tarefa pelo ID.
        """
        task = Task.query.get(task_id)
        if not task:
            abort(404)

        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Tarefa deletada com sucesso!"}), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Tarefa não encontrada!"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Erro interno no servidor."}), 500

    return app


app = create_app()

if __name__ == "__main__":
    # Em dev local; dentro do container também será esse comando
    app.run(host="0.0.0.0", port=5000, debug=True)
