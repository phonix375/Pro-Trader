# Pro-Trader

## Deployed App
https://phonix375.github.io/Pro-Trader/

## User Story
**AS** a user with great interest in learning Stock Exchange Trading,
**I WANT** to see my fictive personal portfolio worth based on real stock market prices and be able to trade (buy and sell) shares, on a same dynamic dashboard.

## Acceptance criterias
1. **WHEN** I open the app for the first time, **THEN** I am presented a form in which I will input my username and the amount of cash I'd like to invest in the simulator
2. **WHEN** I click on the "Sign In" button, **THEN** I will be presented with the main dashboard
3. **WHEN** I look at the main Dashboard for the first time, **THEN** I am will see a left side panel with actionable buttons, I will see my username, the amount of cash I invested, 2 empty tables "My Stocks", "My Transactions" and an empty chart
4. **WHEN** I click on the "Buy" button on the side left panel, **THEN** I am presented a modal with a form in which I can search for stocks symbol based on a company name and in which I can buy stocks with the corresponding quantity. The quantity will also prevent me from buying if I don't have enough money
5. **WHEN** I confirm the buy, the tables and amounts indicators on the main dashboard will be updated based on the current stock market prices
6. **WHEN** I click on the "Sell" button on the side left panel, **THEN** I am presented a modal with a form in which I select the stock to sell and the quantity to sell
7. **WHEN** I click on the button "Sell" to confirm the sell, **THEN** the tables and amounts indicators on the main dashboard will be updated based on the current stock market prices
8. **WHEN** I select a currency in the currency dropdown, **THEN** the whole dashboard will be converted to the selected currency (base currency is USD)

## Built with
- HTML, CSS, Javascript
- Bootstrap 4, jQuery
- Server side APIs:
    - AlphaVantage: https://www.alphavantage.co/
    - CurrencyAPI: https://currencyapi.net/
- Chart.js, Moment.js

## Collaboration tools
- Github Kanban Project
- Github Issues
- Github branch, pull requests
## Developers
- Alexy K.
- Jeff G.
- Billie H.
- Lucile T.

## Screenshots
First login page to enter the name and the starter cash :
![alt text](https://github.com/phonix375/Pro-Trader/blob/main/assets/images/Capture.PNG?raw=true)

Main Dashbord after the first login :
![alt text](https://github.com/phonix375/Pro-Trader/blob/main/assets/images/Capture1.PNG?raw=true)

Change Curency display :
![alt text](https://github.com/phonix375/Pro-Trader/blob/main/assets/images/CurencyChange.gif?raw=true)

Buy stocks : 
![alt text](https://github.com/phonix375/Pro-Trader/blob/main/assets/images/Buyfunction.gif?raw=true)

sell function:
![alt text](https://github.com/phonix375/Pro-Trader/blob/main/assets/images/sellfunction.gif?raw=true)

Info page:
![alt text](https://github.com/phonix375/Pro-Trader/blob/main/assets/images/infoPage.gif?raw=true)


