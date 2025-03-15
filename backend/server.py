'''Landing Page (4): DONE
• 100%  As a user I want to view top 5 rented films of all times
• 100%  As a user I want to be able to click on any of the top 5 films and view its details
• 100%  As a user I want to be able to view top 5 actors that are part of films I have in the store
• 100%  As a user I want to be able to view the actor’s details and view their top 5 rented films
'''


'''Films Page (3):
• 100%  As a user I want to be able to search a film by name of film, name of an actor, or genre of the film
• 100%  As a user I want to be able to view details of the film 
• 100%  As a user I want to be able to rent a film out to a customer
'''


'''
Customer Page (7):
• 100%  As a user I want to view a list of all customers (Pref. using pagination)
• 100%  As a user I want the ability to filter/search customers by their customer id, first name or last name.
• 100%  As a user I want to be able to add a new customer
• 100%  As a user I want to be able to edit a customer’s details
• 100%  As a user I want to be able to delete a customer if they no longer wish to patron at store
• 100%  As a user I want to be able to view customer details and see their past and present rental history
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


@app.route('/customers', methods=['GET', 'POST'])
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

    # Add a customer
    elif request.method == 'POST':
        data = request.json
        cur = mysql.connection.cursor()

        print("got a post")
        cur.execute(get_city_id_from_fields(data))
        city_id = cur.fetchall()
        if len(city_id) == 0:
            print("1) inserting")
            # submitted city is not in city table;
            # insert
            print(a_new_city(data))
            cur.execute(a_new_city(data))
            city_id = cur.lastrowid
        elif len(city_id) > 1:
            print(f'duplicate cities with ids: {city_id}')
            cur.close()
            res = make_response(jsonify({'error': 'Unable to create resource'}), 400)
            return res
        else:
            print("3) else")
            city_id = city_id[0][0]

        print(f'city_id: {city_id}')
        mysql.connection.commit()
        
        # with city id, now get address id
        cur.execute(get_addr_id_from_fields(data, city_id))
        addr_id = cur.fetchall()
        print("executed query")
        if len(addr_id) == 0:
            print("1) inserting")
            # submitted address not in address table;
            # insert
            #print(a_new_addr(data, city_id))
            cur.execute(a_new_addr(data, city_id))
            addr_id = cur.lastrowid
        elif len(addr_id) > 1:
            print(f'duplicate addresses with ids: {addr_id}')
            cur.execute(d_duplicate_addr())

            cur.execute(get_addr_id_from_fields(data, city_id))
            addr_id = cur.fetchall()
            addr_id = addr_id[0][0]
            '''
            res = make_response(jsonify({'error': 'Unable to create resource'}), 400)
            return res
            '''
        else:
            print('3) else')
            addr_id = addr_id[0][0]

        print(f'addr_id: {addr_id}')
        mysql.connection.commit()
        
        # with address id, now insert customer
        cur.execute(a_new_cust(data, addr_id))

        cust_id = cur.lastrowid

        print(f'cust_id: {cust_id}')

        mysql.connection.commit()
        cur.close()
        res = make_response({
            'message': 'New user created',
            'user_id': cust_id,
            'user': data
        }, 201)
        return res 

@app.route('/customers/<customer_id>', methods=['GET', 'PUT', 'DELETE'])
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

    # Edit a customer
    elif request.method == 'PUT':
        data = request.json
        cur = mysql.connection.cursor()
        cur.execute(get_city_id_from_fields(data))
        city_id = cur.fetchall()
        if len(city_id) == 0:
            # submitted city is not in city table;
            # insert
            cur.execute(a_new_city(data))
            city_id = cur.lastrowid
            print(f'inserted city with id: {city_id}')
        elif len(city_id) > 1:
            print(f'duplicate cities with ids: {city_id}')
            cur.close()
            res = make_response(jsonify({'error': 'Unable to create resource'}), 400)
            return res
        else:
            city_id = city_id[0][0]
        
        # with city id, now get address id
        cur.execute(get_addr_id_from_fields(data, city_id))
        addr_id = cur.fetchall()
        if len(addr_id) == 0:
            # submitted address not in address table;
            # insert
            cur.execute(a_new_addr(data, city_id))
            addr_id = cur.lastrowid
        elif len(addr_id) > 1:
            print(f'duplicate addresses with ids: {addr_id}')
            cur.execute(d_duplicate_addr())

            cur.execute(get_addr_id_from_fields(data, city_id))
            addr_id = cur.fetchall()
            addr_id = addr_id[0][0]
        else:
            addr_id = addr_id[0][0]
        
        cur.execute(update_addr(data, addr_id, city_id))
        cur.execute(update_cust_details(customer_id, data, addr_id))
        mysql.connection.commit()
        cur.close()
        return make_response(jsonify({'message': 'resource updated'}), 200)

    elif request.method == 'DELETE':
        print('delete called')
        cur = mysql.connection.cursor()
        cur.execute(d_cust(customer_id))
        mysql.connection.commit()
        cur.close()
        return make_response(jsonify({'message': 'resource deleted'}), 200)

@app.route('/rental_return/<customer_id>', methods=['PUT'])
def update_rental(customer_id):
    data = request.json
    print(data)
    return 'ok'


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

    # TODO: fix case when there is search by actor 
    if len(request.args) != 0:
        sql_query += ' WHERE '
        for k, v in request.args.items():
            arg_list.append(f"{k} LIKE '%{v}%'")
        sql_query += ' OR '.join(arg_list)

    cur.execute(sql_query)
    row_headers=[x[0] for x in cur.description]
    data = cur.fetchall()
    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))
    cur.close()
    return jsonify(data_json)

@app.route('/films/<film_id>', methods=['GET', 'POST'])
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
    elif request.method == 'POST':
        data = request.json
        cur = mysql.connection.cursor()
        cur.execute(a_new_rental(data))
        mysql.connection.commit()
        return make_response(jsonify({'message': 'success'}), 201)

@app.route('/films/<film_id>/actors', methods=['GET'])
def get_film_actors(film_id):
    sql_query = q_film_actors(film_id)
    cur = mysql.connection.cursor()
    cur.execute(sql_query)
    row_headers=[x[0] for x in cur.description]
    data = cur.fetchall()
    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))
    cur.close()
    return jsonify(data_json)

@app.route('/films/<film_id>/inventory', methods=['GET'])
def get_film_inventory(film_id):
    sql_query = q_film_inventory(film_id)
    cur = mysql.connection.cursor()
    cur.execute(sql_query)
    row_headers=[x[0] for x in cur.description]
    data = cur.fetchall()
    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))
    cur.close()
    return jsonify(data_json)

@app.route('/films/<film_id>/language', methods=['GET'])
def get_film_language(film_id):
    sql_query = q_film_language(film_id)
    cur = mysql.connection.cursor()
    cur.execute(sql_query)
    row_headers=[x[0] for x in cur.description]
    data = cur.fetchall()
    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))
    cur.close()
    return jsonify(data_json)

@app.route('/films/<film_id>/availability', methods=['GET'])
def get_film_availability(film_id):
    cur = mysql.connection.cursor()
    cur.execute(q_film_availability(film_id))
    row_headers=[x[0] for x in cur.description]
    data = cur.fetchall()
    data_json = []
    for d in data:
        data_json.append(dict(zip(row_headers, d)))
    cur.close()
    return jsonify(data_json)

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

@app.route('/test/<id>', methods=['GET'])
def test(id):
    cur = mysql.connection.cursor()
    res = inv_in_stock(cur, id)
    cur.close()
    return make_response(jsonify({'response': res}))

def film_in_stock(cursor, res, film_id):
    cursor.execute(q3())

def inv_in_stock(cursor, inventory_id):
    cursor.execute(q1(inventory_id))
    res = cursor.fetchall()
    if res[0][0] == 0:
        return True
    v_rentals = res[0][0]

    cursor.execute(q2(inventory_id))
    res = cursor.fetchall()
    if res[0][0] > 0:
        return False
    return True
    '''
    print(type(res))        # tuple
    print(len(res))         # 1
    print(res[0])
    print(type(res[0]))     # tuple
    print(res[0][0])
    print(type(res[0][0]))  # int
    return res

    '''


if __name__ == '__main__':
    app.run(debug=True)
