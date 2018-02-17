from django.shortcuts import render
from django.http import HttpResponse,HttpRequest
from django.views.decorators.csrf import csrf_exempt
from alpha_vantage.timeseries import TimeSeries
import matplotlib.pyplot as plt
import mpld3
import matplotlib.dates as mdates
from alpha_vantage.sectorperformance import SectorPerformances
import json
import base64
# from rest_framework.response import Response
# Create your views here.
@csrf_exempt
def index(request):
    print(request.body)
    val = int(request.body)
    #print(val)
    # list_of_companies = ["INFY", "GOOGL", "AAPL", "MSFT", "TCS", "AMZN"]
    list_of_companies = ["TITAN","SBIN","HINDUNILVR","MARUTI"]#,"SBIN","HINDUNILVR","MARUTI"
    lst_for_result = []
    for company in list_of_companies:
        #dict_rep_fig2
        # data, dict_rep, dict_rep_fig2 = get_data(company)
        data, dict_rep = get_data(company)
        print("Got Data from "+company)
        if (data['close'][len(data['close'])-1])>val:
            continue
        # print(data)
        # result = get_json_data(data, company, dict_rep, dict_rep_fig2 )
        result = get_json_data(data, company, dict_rep)
        lst_for_result.append(result)
    # get_sector_performance()
    json_data = json.dumps(lst_for_result)
    return HttpResponse(json_data, content_type="application/json")

def get_data(company):
    data, dict_rep = get_daily_data(company)
    # dict_rep_fig2 = get_intraday(company)
    return data, dict_rep #dict_rep_fig2

# def get_daily_data(company):
#     '''Data retrieval from the stock market using Alpha Vantage API for intraday and daily time series'''
#     plt.close()
#     ts = TimeSeries(key='EZ3UZE4SWE1JI2A9', output_format='pandas')
#     data, meta_data = ts.get_daily(symbol="NSE:"+company, outputsize="compact")
#     fig_size = plt.rcParams["figure.figsize"]
#     fig_size[0] = 12
#     fig_size[1] = 5
#     plt.rcParams["figure.figsize"] = fig_size
#     # print(data.index)
#     # fig, ax = plt.subplots(11)
#     # ax.plot(data.index, data['close'])
#     data['close'].plot()
#     plt.title('Daily Times Series for the '+ company + ' stock')
#     # fig.autofmt_xdate()
#     # ax.fmt_xdata = mdates.DateFormatter('%Y-%m-%d')
#     plt.savefig("/Users/rjmac/Desktop/SahanaMD_Project/FrontEnd/src/assets/"+company+"_daily.png", dpi = 1000)
#     mpld3.display(plt.figimage)
#     plt.close()
#     # plt.show()
#     '''Data retrieval complete'''
#     return data

### Original Above

def get_daily_data(company):
    '''Data retrieval from the stock market using Alpha Vantage API for intraday and daily time series'''
    plt.close()
    ts = TimeSeries(key='EZ3UZE4SWE1JI2A9', output_format='pandas')
    data, meta_data = ts.get_daily(symbol="NSE:"+company, outputsize="compact")
    fig_size = plt.rcParams["figure.figsize"]
    fig_size[0] = 12
    fig_size[1] = 7
    plt.rcParams["figure.figsize"] = fig_size
    # print(data.index)
    fig, ax = plt.subplots()
    ax.plot(data.index, data['close'])
    # data['close'].plot()
    ax.set_title('Daily Times Series for the '+ company + ' stock')
    ax.set_xticklabels(data.index, rotation=90, ha='left', fontsize = 10)
    # fig.autofmt_xdate()
    # ax.fmt_xdata = mdates.DateFormatter('%Y-%m-%d')
    # plt.savefig("/Users/rjmac/Desktop/SahanaMD_Project/FrontEnd/src/assets/"+company+"_daily.png", dpi = 1000)
    # mpld3.save_html(fig, company+'_daily_mpld3.html')
    # html_string_daily = mpld3.fig_to_html(fig)
    dictionary_rep = mpld3.fig_to_dict(fig)
    # mpld3.save_json(fig,company+'_daily_mpld3_json.json')
    # print(dictionary_rep)
    plt.close()
    # plt.show()
    '''Data retrieval complete'''
    return data, dictionary_rep





def get_intraday(company):
    '''Data retrieval from the stock market using Alpha Vantage API for intraday and daily time series'''
    plt.close()
    ts = TimeSeries(key='EZ3UZE4SWE1JI2A9', output_format='pandas')
    data, meta_data = ts.get_intraday(symbol=company, interval= "1min", outputsize="full")
    fig_size = plt.rcParams["figure.figsize"]
    fig_size[0] = 12
    fig_size[1] = 5
    plt.rcParams["figure.figsize"] = fig_size
    fig, ax = plt.subplots()
    ax.plot(data.index, data['close'])
    # data['close'].plot()
    ax.set_title('Intraday Times Series for the ' + company + ' stock (15 min)')
    ax.set_xticklabels(data.index, rotation=90, ha='left', fontsize=10)
    # dictionary_rep = mpld3.fig_to_dict(fig)
    # data['close'].plot()
    # plt.title('Intraday Times Series for the ' + company + ' stock (1 min)')
    dictionary_rep = mpld3.fig_to_dict(fig)
    # fig.autofmt_xdate()
    # ax.fmt_xdata = mdates.DateFormatter('%Y-%m-%d')
    # plt.savefig("/Users/rjmac/Desktop/SahanaMD_Project/FrontEnd/src/assets/"+company+ "_intraday.png", dpi=1000)
    plt.close()
    # plt.show()
    '''Data retrieval complete'''
    return dictionary_rep

def get_sector_performance():
    plt.close()
    sp = SectorPerformances(key='EZ3UZE4SWE1JI2A9', output_format='pandas')
    data, meta_data = sp.get_sector()
    fig_size = plt.rcParams["figure.figsize"]
    fig_size[0] = 12
    fig_size[1] = 5
    plt.rcParams["figure.figsize"] = fig_size
    # data['Rank A: Real-Time Performance'].plot(kind='bar')
    # plt.title('Real Time Performance (%) per Sector')
    # fig, ax = plt.subplots()
    # ax.plot(data.index, data['Rank A: Real-Time Performance'], kind='bar')
    data['close'].plot()
    plt.tight_layout()
    plt.grid()
    # ax.set_title('Real Time Performance (%) per Sector')
    # ax.set_xticklabels(data.index, rotation=90, ha='left', fontsize=10)
    # dictionary_rep = mpld3.fig_to_dict(fig)
    # plt.savefig("/Users/rjmac/Desktop/SahanaMD_Project/FrontEnd/src/assets/sector_performance.png", dpi=1000)
    # with open("/Users/rjmac/Desktop/SahanaMD_Project/Angular_Part/src/assets/sector_performance.png", "rb") as imageFile:
    #     str = base64.b64encode(imageFile.read())
    #     print (str)
    plt.close()
    # return dictionary_rep
# def get_json_data(data,company, dict_rep, dict_rep_fig2):
def get_json_data(data,company, dict_rep):
    # print(company+ ": " + html_string_daily)
    result = {}
    result['company_name'] = company
    result['closing_price'] = data['close'][len(data['close']) - 1]
    # result['date'] = data[:,:1][len(data[:,:1]) - 1]
    result['opening_price'] = data['open'][len(data['open']) - 1]
    result['high'] = data['high'][len(data['high']) - 1]
    result['low'] = data['low'][len(data['low']) - 1]
    result['volume'] = data['volume'][len(data['volume']) - 1]
    result['intra_day_image'] = "../../assets/"+company+"_intraday.png"
    result['daily_image'] = "../../assets/"+company+"_daily.png"
    result['sector_image'] = "../../assets/sector_performance.png"
    result['dict_rep'] = dict_rep
    result['dataFrame'] = data.to_json(orient='split')
    # result['dict_rep_fig2'] = dict_rep_fig2
    return result
