using Microsoft.EntityFrameworkCore;
using SqlInjectionDemo.Models;
using System;
using System.Linq;

namespace SqlInjectionDemo.Data
{
    public static class DatabaseInitializer
    {
        public static void Initialize(OrdersContext context)
        {
            // Ensures the database is created
            context.Database.EnsureCreated();

            // Check if any orders are already present
            if (context.Orders.Any())
            {
                return; // DB has already been seeded
            }

            var orders = new Order[]
            {
                new Order { ProductName = "Firewall Flamethrower", Price = 99.99M },
                new Order { ProductName = "Antivirus Anteater", Price = 49.49M },
                new Order { ProductName = "Malware Marshmallow", Price = 19.89M },
                new Order { ProductName = "Phishing Philter", Price = 39.99M },
                new Order { ProductName = "Trojan Horse Tranquilizer", Price = 59.99M },
                new Order { ProductName = "Spyware Spatula", Price = 24.99M },
                new Order { ProductName = "Ransomware Rattle", Price = 29.99M },
                new Order { ProductName = "Adware Airhorn", Price = 14.99M },
                new Order { ProductName = "Worm Wrangler Whip", Price = 44.99M },
                new Order { ProductName = "Rootkit Rake", Price = 34.99M },
                new Order { ProductName = "DDoS Deterrent Duck", Price = 49.99M },
                new Order { ProductName = "Encryption Enigma", Price = 89.99M },
                new Order { ProductName = "Virus Vacuum", Price = 74.99M },
                new Order { ProductName = "Keylogger Cake", Price = 29.99M },
                new Order { ProductName = "Patchwork Pillow", Price = 19.99M },
                new Order { ProductName = "Buffer Overflow Boat", Price = 59.99M },
                new Order { ProductName = "SQL Injector", Price = 99.99M },
                new Order { ProductName = "Backdoor Broom", Price = 39.99M },
                new Order { ProductName = "Botnet Butterfly Net", Price = 24.99M },
                new Order { ProductName = "Crypto Cracker", Price = 79.99M },
                new Order { ProductName = "Exploit Extractor", Price = 69.99M },
                new Order { ProductName = "Hacker Hammock", Price = 49.99M },
                new Order { ProductName = "Logic Bomb Lollipop", Price = 9.99M },
                new Order { ProductName = "Malicious Muffin", Price = 14.99M },
                new Order { ProductName = "Network Noodles", Price = 19.99M },
                new Order { ProductName = "Payload Popsicle", Price = 14.99M },
                new Order { ProductName = "Script Kiddie Kit", Price = 29.99M },
                new Order { ProductName = "Spoofing Spoon", Price = 12.99M },
                new Order { ProductName = "Zero-Day Zucchini", Price = 22.99M },
                new Order { ProductName = "Cross-Site Scripting Xylophone", Price = 34.99M }
            };

            foreach (var order in orders)
            {
                context.Orders.Add(order);
            }

            context.SaveChanges();
        }
    }
}
