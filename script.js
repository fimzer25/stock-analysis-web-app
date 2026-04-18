document.addEventListener("DOMContentLoaded", () => {
  let darkMode = true;

  // Load dark mode preference from localStorage
  darkMode = localStorage.getItem("theme") === "light" ? false : true;
  document.body.classList.toggle("light-mode", !darkMode);

  // --- Initialize balance ---
  let balance = 1000;
  const balanceElem = document.querySelector(".balance");
  if (balanceElem) {
    balanceElem.textContent = `Bal: ${balance.toFixed(2)} USD`;
  }

  // Load TradingView widget with a symbol and theme
  function loadTradingViewWidget(symbol, theme) {
    const container = document.querySelector(".tradingview-widget-container");
    container.innerHTML = "";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "610",
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: theme,
      style: "1",
      locale: "en",
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      save_image: false,
      watchlist: [
        "COINBASE:ETHUSD",
        "NASDAQ:AAPL",
        "OANDA:XAUUSD",
        "AMEX:SPY",
        "NASDAQ:TSLA",
        "NASDAQ:NVDA",
      ],
      details: true,
      hotlist: true,
      support_host: "https://www.tradingview.com",
    });

    container.appendChild(script);
  }

  // Load Heatmaps with dynamic theme
  function renderHeatmaps(theme) {
    const stockContainer = document.getElementById("stock-heatmap");
    const cryptoContainer = document.getElementById("crypto-heatmap");

    if (stockContainer && cryptoContainer) {
      stockContainer.innerHTML = `
        <div class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js" async>
          {
            "dataSource": "SPX500",
            "grouping": "sector",
            "blockSize": "market_cap_basic",
            "blockColor": "change",
            "locale": "en",
            "colorTheme": "${theme}",
            "hasTopBar": false,
            "isZoomEnabled": true,
            "hasSymbolTooltip": true,
            "width": "100%",
            "height": 500
          }
          </script>
        </div>
      `;

      cryptoContainer.innerHTML = `
        <div class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js" async>
          {
            "dataSource": "Crypto",
            "blockSize": "market_cap_calc",
            "blockColor": "24h_close_change|5",
            "locale": "en",
            "colorTheme": "${theme}",
            "hasTopBar": false,
            "isZoomEnabled": true,
            "hasSymbolTooltip": true,
            "width": "100%",
            "height": 500
          }
          </script>
        </div>
      `;
    }
  }

  loadTradingViewWidget("INDEX:BTCUSD", darkMode ? "dark" : "light");
  renderHeatmaps(darkMode ? "dark" : "light");

  const searchBtn = document.getElementById("search-btn");
  const stockInput = document.getElementById("stock-symbol");
  const errorMsg = document.getElementById("search-error");

  searchBtn.addEventListener("click", () => {
    const symbol = stockInput.value.trim().toUpperCase();
    if (!symbol) {
      errorMsg.textContent = "Please enter a stock symbol.";
      errorMsg.style.display = "block";
      return;
    }
    errorMsg.style.display = "none";

    let formattedSymbol = symbol;
    loadTradingViewWidget(formattedSymbol, darkMode ? "dark" : "light");
  });

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateTab(tab);
      }
    });
  });

  function activateTab(selectedTab) {
    tabs.forEach((tab) => tab.classList.remove("active"));
    selectedTab.classList.add("active");
  }

  const toggles = document.querySelectorAll(".toggle-group .toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => activateToggle(toggle));
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateToggle(toggle);
      }
    });
  });

  function activateToggle(selectedToggle) {
    toggles.forEach((toggle) => {
      toggle.classList.remove("active");
      toggle.setAttribute("aria-pressed", "false");
    });
    selectedToggle.classList.add("active");
    selectedToggle.setAttribute("aria-pressed", "true");

    const buyNowBtn = document.querySelector(".buynow");
    if (buyNowBtn) buyNowBtn.textContent = selectedToggle.textContent;
  }

  const actions = document.querySelectorAll(".actions .action");
  actions.forEach((action) => {
    action.addEventListener("click", () => activateAction(action));
    action.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateAction(action);
      }
    });
  });

  function activateAction(selectedAction) {
    actions.forEach((action) => action.classList.remove("active"));
    selectedAction.classList.add("active");
  }

  const buyNowBtn = document.querySelector(".buynow");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      const amountInput = document.querySelector(".amount-input input");
      const amountValue = parseFloat(amountInput.value);

      if (!amountValue || amountValue <= 0) {
        alert("You need to enter an amount in USD to proceed.");
        return;
      }

      if (amountValue > balance) {
        alert("Insufficient balance.");
        return;
      }

      const activeToggle = document.querySelector(".toggle-group .toggle.active");
      const action = activeToggle ? activeToggle.textContent : "Buy";

      balance -= amountValue;

      if (balanceElem) {
        balanceElem.textContent = `Bal: ${balance.toFixed(2)} USD`;
      }

      alert(`${action} button clicked with ${amountValue} USD. New balance: ${balance.toFixed(2)} USD`);
    });

    buyNowBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        alert("Buy button activated via keyboard!");
      }
    });
  }

  const tickerStocks = [
    { symbol: "AAPL", price: 176.45, change: 1.23 },
    { symbol: "MSFT", price: 326.12, change: -0.87 },
    { symbol: "GOOG", price: 133.55, change: 0.45 },
    { symbol: "TSLA", price: 687.23, change: -3.12 },
    { symbol: "AMZN", price: 124.95, change: 2.15 },
    { symbol: "NVDA", price: 468.44, change: 0.98 },
  ];

  const tickerContent = document.querySelector(".ticker-content");

  function formatChange(change) {
    const sign = change >= 0 ? "+" : "";
    const className = change >= 0 ? "" : "negative";
    return `<span class="stock-change ${className}">${sign}${change.toFixed(2)}</span>`;
  }

  function generateTickerContent() {
    let content = "";
    for (let i = 0; i < 2; i++) {
      tickerStocks.forEach(({ symbol, price, change }) => {
        content += `
          <span class="stock-item">
            <span class="stock-symbol">${symbol}</span>
            <span class="stock-price">${price.toFixed(2)}</span>
            ${formatChange(change)}
          </span>
        `;
      });
    }
    if (tickerContent) tickerContent.innerHTML = content;
  }

  generateTickerContent();

  setInterval(() => {
    tickerStocks.forEach(stock => {
      const delta = (Math.random() - 0.5) * 2;
      stock.price = Math.max(0, stock.price + delta);
      stock.change = (Math.random() - 0.5) * 2;
    });
    generateTickerContent();
  }, 10000);

  const modeToggle = document.querySelector(".mode-toggle");
  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      darkMode = !darkMode;
      document.body.classList.toggle("light-mode", !darkMode);
      localStorage.setItem("theme", darkMode ? "dark" : "light");

      const currentSymbol = stockInput.value.trim().toUpperCase() || "INDEX:BTCUSD";
      loadTradingViewWidget(currentSymbol, darkMode ? "dark" : "light");
      renderHeatmaps(darkMode ? "dark" : "light");
    });
  }

  // ENHANCED ORDER BOOK WITH DEPTH CHART 
  const buyOrders = [];
  const sellOrders = [];
  const rowsCount = 20;

  // Initialize orders with more realistic distribution
  for (let i = 0; i < rowsCount; i++) {
    buyOrders.push({
      price: (1000 - i * 0.5).toFixed(2),
      amount: (Math.random() * 5 + 1).toFixed(3), 
      updated: false,
    });
    sellOrders.push({
      price: (1000 + i * 0.5).toFixed(2),
      amount: (Math.random() * 5 + 1).toFixed(3), 
      updated: false,
    });
  }

  const buyList = document.getElementById("buy-orders");
  const sellList = document.getElementById("sell-orders");
  const depthChart = document.getElementById("depth-chart");

  // Function to calculate cumulative amounts for depth chart
  function calculateDepthData() {
    // Sort orders (just in case)
    const sortedBuys = [...buyOrders].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    const sortedSells = [...sellOrders].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    
    // Calculate cumulative amounts
    let buyCumulative = 0;
    const buyDepth = sortedBuys.map(order => {
      buyCumulative += parseFloat(order.amount);
      return {
        price: parseFloat(order.price),
        amount: parseFloat(order.amount),
        cumulative: buyCumulative
      };
    });
    
    let sellCumulative = 0;
    const sellDepth = sortedSells.map(order => {
      sellCumulative += parseFloat(order.amount);
      return {
        price: parseFloat(order.price),
        amount: parseFloat(order.amount),
        cumulative: sellCumulative
      };
    });
    
    return { buyDepth, sellDepth };
  }

  // Function to render depth chart using SVG
  function renderDepthChart() {
    if (!depthChart) return;
    
    const { buyDepth, sellDepth } = calculateDepthData();
    const maxCumulative = Math.max(
      ...buyDepth.map(d => d.cumulative),
      ...sellDepth.map(d => d.cumulative)
    );
    
    const minPrice = buyDepth.length > 0 ? buyDepth[buyDepth.length - 1].price : 990;
    const maxPrice = sellDepth.length > 0 ? sellDepth[sellDepth.length - 1].price : 1010;
    const midPrice = (minPrice + maxPrice) / 2;
    
    const width = depthChart.clientWidth;
    const height = depthChart.clientHeight;
    const padding = 20;
    
    // Clear previous chart
    depthChart.innerHTML = '';
    
    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    
    // Helper function to map price to x coordinate
    const priceToX = (price) => {
      return padding + ((price - minPrice) / (maxPrice - minPrice)) * (width - 2 * padding);
    };
    
    // Helper function to map cumulative amount to y coordinate
    const amountToY = (amount) => {
      return height - padding - (amount / maxCumulative) * (height - 2 * padding);
    };
    
    // Draw mid price line
    const midLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    midLine.setAttribute("x1", priceToX(midPrice));
    midLine.setAttribute("y1", padding);
    midLine.setAttribute("x2", priceToX(midPrice));
    midLine.setAttribute("y2", height - padding);
    midLine.setAttribute("stroke", darkMode ? "#555" : "#ddd");
    midLine.setAttribute("stroke-dasharray", "5,5");
    svg.appendChild(midLine);
    
    // Draw buy depth area
    if (buyDepth.length > 0) {
      const buyPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      let d = `M ${priceToX(buyDepth[0].price)} ${amountToY(0)}`;
      
      for (let i = 0; i < buyDepth.length; i++) {
        d += ` L ${priceToX(buyDepth[i].price)} ${amountToY(buyDepth[i].cumulative)}`;
      }
      
      d += ` L ${priceToX(buyDepth[buyDepth.length - 1].price)} ${amountToY(0)} Z`;
      buyPath.setAttribute("d", d);
      buyPath.setAttribute("fill", darkMode ? "rgba(0, 180, 0, 0.3)" : "rgba(0, 200, 0, 0.3)");
      buyPath.setAttribute("stroke", darkMode ? "#0a0" : "#080");
      buyPath.setAttribute("stroke-width", "1");
      svg.appendChild(buyPath);
    }
    
    // Draw sell depth area
    if (sellDepth.length > 0) {
      const sellPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      let d = `M ${priceToX(sellDepth[0].price)} ${amountToY(0)}`;
      
      for (let i = 0; i < sellDepth.length; i++) {
        d += ` L ${priceToX(sellDepth[i].price)} ${amountToY(sellDepth[i].cumulative)}`;
      }
      
      d += ` L ${priceToX(sellDepth[sellDepth.length - 1].price)} ${amountToY(0)} Z`;
      sellPath.setAttribute("d", d);
      sellPath.setAttribute("fill", darkMode ? "rgba(180, 0, 0, 0.3)" : "rgba(200, 0, 0, 0.3)");
      sellPath.setAttribute("stroke", darkMode ? "#a00" : "#800");
      sellPath.setAttribute("stroke-width", "1");
      svg.appendChild(sellPath);
    }
    
    // Add current price label
    const priceLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    priceLabel.setAttribute("x", priceToX(midPrice));
    priceLabel.setAttribute("y", padding + 15);
    priceLabel.setAttribute("text-anchor", "middle");
    priceLabel.setAttribute("fill", darkMode ? "#fff" : "#000");
    priceLabel.setAttribute("font-size", "12");
    priceLabel.textContent = midPrice.toFixed(2);
    svg.appendChild(priceLabel);
    
    depthChart.appendChild(svg);
  }

  function renderOrders() {
    if (!buyList || !sellList) return;
    
    buyList.innerHTML = buyOrders
      .map((o) => `
        <div class="orderbook-row buy ${o.updated ? "updated" : ""}">
          <span class="price">${o.price}</span>
          <span class="amount">${o.amount}</span>
        </div>
      `).join("");

    sellList.innerHTML = sellOrders
      .map((o) => `
        <div class="orderbook-row sell ${o.updated ? "updated" : ""}">
          <span class="price">${o.price}</span>
          <span class="amount">${o.amount}</span>
        </div>
      `).join("");
  }

  function updateOrders() {
    let buyIndex = Math.floor(Math.random() * rowsCount);
    buyOrders[buyIndex].price = (
      parseFloat(buyOrders[buyIndex].price) + (Math.random() - 0.5) * 0.2
    ).toFixed(2);
    buyOrders[buyIndex].amount = (Math.random() * 5 + 1).toFixed(3);
    buyOrders[buyIndex].updated = true;

    let sellIndex = Math.floor(Math.random() * rowsCount);
    sellOrders[sellIndex].price = (
      parseFloat(sellOrders[sellIndex].price) + (Math.random() - 0.5) * 0.2
    ).toFixed(2);
    sellOrders[sellIndex].amount = (Math.random() * 5 + 1).toFixed(3);
    sellOrders[sellIndex].updated = true;

    setTimeout(() => {
      buyOrders.forEach((o) => (o.updated = false));
      sellOrders.forEach((o) => (o.updated = false));
    }, 1000);
  }

  function animateScroll() {
    let buyY = 0;
    let sellY = 0;
    const speed = 0.5;

    function step() {
      buyY -= speed;
      sellY -= speed;

      if (buyList && sellList) {
        if (buyY <= -buyList.scrollHeight / 2) buyY = 0;
        if (sellY <= -sellList.scrollHeight / 2) sellY = 0;

        buyList.style.transform = `translateY(${buyY}px)`;
        sellList.style.transform = `translateY(${sellY}px)`;
      }

      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function duplicateLists() {
    if (!buyList || !sellList) return;
    buyList.innerHTML += buyList.innerHTML;
    sellList.innerHTML += sellList.innerHTML;
  }

  // Initial render
  renderOrders();
  renderDepthChart();
  duplicateLists();
  animateScroll();

  // Update orders and depth chart periodically
  setInterval(() => {
    updateOrders();
    renderOrders();
    renderDepthChart();
    if (buyList && sellList) {
      buyList.innerHTML = buyList.innerHTML.slice(0, buyList.innerHTML.length / 2);
      sellList.innerHTML = sellList.innerHTML.slice(0, sellList.innerHTML.length / 2);
    }
    duplicateLists();
  }, 2000);

  // NEWS TICKER 
  const newsItems = [
    "Breaking: Market hits all-time high!",
    "Tech stocks rally after new product launches.",
    "Federal Reserve signals possible interest rate hike.",
    "Cryptocurrency volatility spikes amid regulation news.",
    "Energy sector sees strong quarterly earnings.",
    "New startup IPO attracts massive investor interest.",
    "Global supply chain disruptions ease slightly.",
    "Analysts predict bullish trend for the next quarter.",
  ];

  const newsTicker = document.querySelector(".news-ticker");

  function populateNews() {
    if (!newsTicker) return;

    newsTicker.innerHTML = ""; 

    // Repeat news twice for smooth looping
    const allNews = newsItems.concat(newsItems);

    allNews.forEach(text => {
      const span = document.createElement("span");
      span.className = "news-item";
      span.textContent = text;
      newsTicker.appendChild(span);
    });
  }

  populateNews();

  // PREDICTION BOX 
  const dateInput = document.getElementById('predictionbox-date');
  const historicalPriceEl = document.getElementById('historical-price');
  const predictedPriceEl = document.getElementById('predicted-price');
  const updateTimeEl = document.getElementById('predictionbox-update-time');

  const priceData = {
    "2025-06-01": { historical: 140.25, predicted: 142.80 },
    "2025-06-02": { historical: 141.00, predicted: 143.10 },
    "2025-06-03": { historical: 140.80, predicted: 143.50 },
    "2025-06-04": { historical: 141.50, predicted: 144.00 },
    "2025-06-05": { historical: 142.00, predicted: 144.50 },
    "2025-06-06": { predicted: 145.00 }, 
    "2025-06-07": { predicted: 145.50 }
  };

  // Helper to get today's date string YYYY-MM-DD
  function getTodayStr() {
    return new Date().toISOString().split('T')[0];
  }

  // Initialize input date - default to today if available, else last known date
  const todayStr = getTodayStr();
  dateInput.value = priceData[todayStr] ? todayStr : Object.keys(priceData).slice(-1)[0];

  function updatePredictionBox(selectedDate) {
    const today = new Date(getTodayStr());
    const selected = new Date(selectedDate);

    const data = priceData[selectedDate];
    if (!data) {
      // No data for date
      historicalPriceEl.textContent = '--';
      predictedPriceEl.textContent = '--';
      updateTimeEl.textContent = 'No data available for selected date';
      return;
    }

    if (selected < today) {
      
      historicalPriceEl.textContent = data.historical !== undefined ? `$${data.historical.toFixed(2)}` : 'No historical data';
      predictedPriceEl.textContent = data.predicted !== undefined ? `$${data.predicted.toFixed(2)}` : 'No prediction available';
    } else if (selected.toDateString() === today.toDateString()) {
      
      historicalPriceEl.textContent = data.historical !== undefined ? `$${data.historical.toFixed(2)}` : 'No historical data';
      predictedPriceEl.textContent = data.predicted !== undefined ? `$${data.predicted.toFixed(2)}` : 'No prediction available';
    } else {
      
      historicalPriceEl.textContent = 'No historical data';
      predictedPriceEl.textContent = data.predicted !== undefined ? `$${data.predicted.toFixed(2)}` : 'No prediction available';
    }

    updateTimeEl.textContent = new Date().toLocaleString();
  }

  // Initial update
  updatePredictionBox(dateInput.value);

  // Listen for date changes
  dateInput.addEventListener('change', e => {
    updatePredictionBox(e.target.value);
  });
});
// Sidebar functionality
const sidebarToggle = document.querySelector('.sidebar-toggle');
const closeSidebar = document.querySelector('.close-sidebar');
const newsSidebar = document.querySelector('.news-sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const newsCategories = document.querySelectorAll('.news-categories .category');

// Toggle sidebar
sidebarToggle.addEventListener('click', () => {
  newsSidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
});

closeSidebar.addEventListener('click', () => {
  newsSidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
});

sidebarOverlay.addEventListener('click', () => {
  newsSidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
});

// Category selection
newsCategories.forEach(category => {
  category.addEventListener('click', () => {
    newsCategories.forEach(c => c.classList.remove('active'));
    category.classList.add('active');
    
  });
});

// News card interaction
const newsCards = document.querySelectorAll('.news-card');
newsCards.forEach(card => {
  card.addEventListener('click', () => {
   
    const title = card.querySelector('.news-title').textContent;
    alert(`Opening news article: "${title}"\n\nStill not yet developed.`);
  });
});

// Simulate updating news time
function updateNewsTime() {
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const timeString = now.toLocaleTimeString('en-US', options);
  document.getElementById('news-update-time').textContent = timeString;
}

setInterval(updateNewsTime, 1000);
updateNewsTime();
// Order Book Data and Rendering (Frequent Updates Version)
function generateOrderBookData() {
    // Generate bids with slight random fluctuations
    const bids = [];
    let currentBidPrice = 42000 + (Math.random() * 200 - 100); 
    for (let i = 0; i < 15; i++) {
        const priceChange = (Math.random() * 20 - 10); 
        const price = currentBidPrice + priceChange;
        const amount = 0.5 + Math.random() * 1.5; 
        bids.push({
            price: price.toFixed(2),
            amount: amount.toFixed(6),
            total: (price * amount).toFixed(2)
        });
        currentBidPrice = price - 1; 
    }

    // Generate asks with slight random fluctuations
    const asks = [];
    let currentAskPrice = 42050 + (Math.random() * 200 - 100);
    for (let i = 0; i < 15; i++) {
        const priceChange = (Math.random() * 20 - 10); 
        const price = currentAskPrice + priceChange;
        const amount = 0.5 + Math.random() * 1.5; 
        asks.push({
            price: price.toFixed(2),
            amount: amount.toFixed(6),
            total: (price * amount).toFixed(2)
        });
        currentAskPrice = price + 1;
    }

    return { bids, asks };
}

// Optimized rendering function
function renderOrderBook() {
    const { bids, asks } = generateOrderBookData();
    const bidsList = document.getElementById('bidsList');
    const asksList = document.getElementById('asksList');

    // More efficient DOM updates
    const updateList = (listElement, orders, type) => {
        let html = '';
        orders.forEach(order => {
            html += `
                <div class="orderbook-row ${type}">
                    <span>${order.price}</span>
                    <span>${order.amount}</span>
                    <span>${order.total}</span>
                </div>
            `;
        });
        listElement.innerHTML = html;
    };

    updateList(bidsList, bids, 'buy');
    updateList(asksList, asks, 'sell');
    updateDepthChart(bids, asks);
}

// Optimized depth chart rendering
function updateDepthChart(bids, asks) {
    const depthChart = document.getElementById('depthChart');
    
    // Calculate max volume for scaling
    const maxBidVolume = Math.max(...bids.map(b => parseFloat(b.total)));
    const maxAskVolume = Math.max(...asks.map(a => parseFloat(a.total)));
    const maxVolume = Math.max(maxBidVolume, maxAskVolume);
    
    // Generate SVG for better performance
    depthChart.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 L50,${100 - (maxBidVolume/maxVolume*70)} C60,${100 - (maxBidVolume/maxVolume*60)} 65,${100 - (maxBidVolume/maxVolume*50)} 50,${100 - (maxBidVolume/maxVolume*40)} L0,100" 
                  fill="rgba(29, 185, 84, 0.3)" stroke="none" />
            <path d="M100,100 L50,${100 - (maxAskVolume/maxVolume*70)} C40,${100 - (maxAskVolume/maxVolume*60)} 35,${100 - (maxAskVolume/maxVolume*50)} 50,${100 - (maxAskVolume/maxVolume*40)} L100,100" 
                  fill="rgba(241, 67, 67, 0.3)" stroke="none" />
        </svg>
    `;
}

// Initialize with frequent updates
document.addEventListener('DOMContentLoaded', () => {
    renderOrderBook();
    
    // Update every 500ms (half second) for high frequency
    setInterval(renderOrderBook, 500);
});