# standard import
import os

# flask imports
from flask_wtf import FlaskForm
from werkzeug.utils import secure_filename
from wtforms import SubmitField, SelectField
from flask import Flask, render_template, url_for
from flask_wtf.file import FileField, FileAllowed

MAPS = [os.path.splitext(file)[0] for file in os.listdir("static/maps") if file != "uploads"]
UPLOAD_FOLDER = "static/maps/uploads/"
ALLOWED_EXTENSIONS = ["png"]

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

class FileForm(FlaskForm):
	file = FileField("Import map", validators=[FileAllowed(ALLOWED_EXTENSIONS, "Images only!")])
	submit = SubmitField("Load")
class MapForm(FlaskForm):
	maps = SelectField("Select map", choices=MAPS)
	submit = SubmitField("Load")

@app.after_request
def add_header(r):
	"""Disable cache."""
	r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
	r.headers["Pragma"] = "no-cache"
	r.headers["Expires"] = "0"
	r.headers["Cache-Control"] = "public, max-age=0"
	return r

@app.route("/", methods=["GET", "POST"])
def index():
	file_form = FileForm()
	map_form = MapForm()
	if not map_form.maps.data:
		map_form.maps.data = MAPS[0]
	if file_form.validate_on_submit() and file_form.file.data:
		file = file_form.file.data
		filename = secure_filename(file.filename)
		upload_folder = os.path.join(UPLOAD_FOLDER, filename)
		file.save(upload_folder)
		return render_template("index.html", file=url_for("static", filename=os.path.join("maps/uploads", filename)), file_form=file_form, map_form=map_form)
	elif file_form.file.data:
		return "Invalid file format. Must be a transparent png image format."
	map = map_form.maps.data
	return render_template("index.html", file=url_for("static", filename=f"maps/{map}.png"), file_form=file_form, map_form=map_form)


os.environ["FLASK_ENV"] = "development"
os.environ["SECRET_KEY"] = "XZr435dsDs"
app.run(debug=True)
