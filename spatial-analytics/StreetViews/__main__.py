# priority_model/__main__.py
import config
from . import model_to_hundred_feet
from . import project_model_to_street
from . import project_service_lines_hundred_ft

def main():
    print("Excecuting StreetViews...")
    print("----------------------")

    print("Projecting Model to Streets...")
    project_model_to_street(model_path=config.MODEL)
    print("----------------------")

    print("Projecting Service Lines to 100ft Segments...")
    model_to_hundred_feet(model_path= config.STREET_MODEL)
    print("----------------------")

    print("Counting Risky Service Lines per 100ft segments...")
    project_service_lines_hundred_ft(street_segments_path= config.STREET_MODEL_HUNDRED_FOOT, service_line_path=config.SERVICE_LINES) 

if __name__ == "__main__":
    main()