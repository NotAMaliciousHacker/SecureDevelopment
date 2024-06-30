using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SqlInjectionDemo.Data;
using SqlInjectionDemo.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SqlInjectionDemo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrdersContext _context;

        public OrdersController(OrdersContext context)
        {
            _context = context;
        }

        // GET: /orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders.ToListAsync();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Order>>> SearchOrders(string productName)
        {
            var query = $"SELECT * FROM Orders WHERE ProductName LIKE '%{productName}%'";
            var orders = await _context.Orders.FromSqlRaw(query).ToListAsync();
            return orders;
        }
    }
}
