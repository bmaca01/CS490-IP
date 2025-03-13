'''Landing Page (4): DONE
• 100%  As a user I want to view top 5 rented films of all times
• 100%  As a user I want to be able to click on any of the top 5 films and view its details
• 100%  As a user I want to be able to view top 5 actors that are part of films I have in the store
• 100%  As a user I want to be able to view the actor’s details and view their top 5 rented films
'''


'''Films Page (3):
•  50%  As a user I want to be able to search a film by name of film, name of an actor, or genre of the film
•  50%  As a user I want to be able to view details of the film 
•   0%  As a user I want to be able to rent a film out to a customer
'''


'''
Customer Page (7):
• 100%  As a user I want to view a list of all customers (Pref. using pagination)
• 100%  As a user I want the ability to filter/search customers by their customer id, first name or last name.
•  50%  As a user I want to be able to add a new customer
•  50%  As a user I want to be able to edit a customer’s details
•   0%  As a user I want to be able to delete a customer if they no longer wish to patron at store
•  50%  As a user I want to be able to view customer details and see their past and present rental history
•   0%  As a user I want to be able to indicate that a customer has returned a rented movie
'''

from flask import Flask, jsonify, request, make_response
from flask_mysqldb import MySQL
from flask_cors import CORS
#from flask_restful import Resource, Api, reqparse

from queries import *

app = Flask(__name__)
app.config['MYSQL_USER'] = 'flask_app'
app.config['MYSQL_PASSWORD'] = 'abc'
app.config['MYSQL_DB'] = 'sakila'
app.config['MYSQL_HOST'] = '172.21.16.1'

mysql = MySQL(app)
cors = CORS(app, origins='*')

@app.route('/countries', methods=['GET'])
def countries():
    cur = mysql.connection.cursor()
    cur.execute(q_ALL_COUNTRIES)
    row_headers = [x[0] for x in cur.description]
    data = cur.fetchall()
    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))
    cur.close()

    return jsonify({'countries': data_json})


@app.route('/customers', methods=['GET', 'POST', 'PATCH'])
def customers():
    if request.method == 'GET':
        query_all = q_ALL_CUSTOMER       

        query = q_ALL_CUSTOMER_NULL_RETURN

        arg_list = []
        if len(request.args) != 0:
            query_all += ' WHERE '
            for k, v in request.args.items():
                match k:
                    case 'customer_id':
                        arg_list.append(f"{k} = '{v}'")
                    case 'first_name' | 'last_name':
                        arg_list.append(f"{k} LIKE '%{v}%'")
            query_all += ' OR '.join(arg_list)
        cur = mysql.connection.cursor()

        if len(arg_list) != 0:
            cur.execute(query_all)
        else:
            cur.execute(query)
        row_headers = [x[0] for x in cur.description]
        data = cur.fetchall()
        data_json = []
        for d in data:
            data_json.append(dict(zip(row_headers, d)))
        cur.close()
        return jsonify({'customers': data_json})

    elif request.method == 'POST':
        data = request.json
        print('got a post')
        return jsonify({'request': data})


class Customer:
    c_id = None


@app.route('/customers/<customer_id>', methods=['GET', 'PUT'])
def customer_route(customer_id):
    if request.method == 'GET':
        query = q_customer_details(customer_id)

        cur = mysql.connection.cursor()
        cur.execute(query)
        row_headers = [x[0] for x in cur.description]
        data = cur.fetchall()
        data_json = []
        for d in data:
            data_json.append(dict(zip(row_headers, d)))
        cur.close()
        return jsonify({'details': data_json})
    if request.method == 'PUT':
        data = request.json
        print(f'got a put with: {data}')
        return jsonify(data)


@app.route('/top-5-actors', methods=['GET'])
def get_top_actors():
    cur = mysql.connection.cursor()
    cur.execute(q_TOP_FIVE_ACTORS)

    row_headers=[x[0] for x in cur.description]
    data = cur.fetchall()

    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))

    cur.close()
    return jsonify({'top_5_actors': data_json})

@app.route('/top-5-films', methods=['GET'])
def get_top_films():
    cur = mysql.connection.cursor()
    cur.execute(q_TOP_FIVE_FILMS)

    row_headers=[x[0] for x in cur.description]
    data = cur.fetchall()

    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))

    cur.close()
    return jsonify({'top_5_movies': data_json})

@app.route('/films', methods=['GET'])
def get_films():
    sql_query = q_ALL_FILMS
    cur = mysql.connection.cursor()

    arg_list = []

    if len(request.args) != 0:
        sql_query += ' WHERE '
        for k, v in request.args.items():
            arg_list.append(f"{k} = '{v}'")
        sql_query += ' OR '.join(arg_list)

    cur.execute(sql_query)
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    data = cur.fetchall()
    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))
    cur.close()
    return jsonify(data_json)

@app.route('/films/<film_id>', methods=['GET', 'PUT'])
def get_film_details(film_id):
    if request.method == 'GET':
        sql_query = q_film_details(film_id)
        cur = mysql.connection.cursor()

        cur.execute(sql_query)
        row_headers=[x[0] for x in cur.description] #this will extract row headers
        data = cur.fetchall()
        data_json = []
        for d in data:
            data_json.append(dict(zip(row_headers, d)))
        cur.close()
        return jsonify({'film': data_json})
        #return jsonify(data_json)
    elif request.method == 'PUT':
        pass

@app.route('/actors/<actor_id>', methods=['GET'])
def get_actor_details(actor_id):
    sql_query = q_actor_details(actor_id)
    cur = mysql.connection.cursor()

    cur.execute(sql_query)
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    data = cur.fetchall()
    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))
    cur.close()
    return jsonify({'actor': data_json})

if __name__ == '__main__':
    app.run(debug=True)
