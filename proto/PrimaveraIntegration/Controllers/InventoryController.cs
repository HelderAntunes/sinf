using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PrimaveraIntegration.Lib_Primavera.Model;

namespace PrimaveraIntegration.Controllers
{
    public class InventoryController : ApiController
    {
        // GET api/inventory   
        public List<Lib_Primavera.Model.Stock> GetInventory()
        {
            return Lib_Primavera.PriIntegration.getInventoryTotals();
            // return new List<Lib_Primavera.Model.Stock>();
        }

        public List<Lib_Primavera.Model.Stock> GetInventory(string id)
        {
            if (id == "outOfStock")
                return Lib_Primavera.PriIntegration.getInventoryOutOfStock();
            else
            {
                var stock = new List<Lib_Primavera.Model.Stock>();
                stock.Add(Lib_Primavera.PriIntegration.GetStock(id));
                return stock;
            }
        }

        public List<Lib_Primavera.Model.StockMovement> GetGroupedInventoryByYear(string id, int year)
        {
            if (id == "inMovements")
                return Lib_Primavera.PriIntegration.ListSTKMovementIn(year.ToString(), null);
            else if (id == "outMovements")
                return Lib_Primavera.PriIntegration.ListSTKMovementOut(year.ToString(), null);
            else
            {
                return null;
            }
        }

        public List<Lib_Primavera.Model.StockMovement> GetGroupedInventoryByMonth(string id, int year, int month)
        {
            if (id == "inMovements")
                return Lib_Primavera.PriIntegration.ListSTKMovementIn(year.ToString(), month.ToString());
            else if (id == "outMovements")
                return Lib_Primavera.PriIntegration.ListSTKMovementOut(year.ToString(), month.ToString());
            else
            {
                return null;
            }
        }

        // GET api/inventory   
        public List<Lib_Primavera.Model.Stock> GetInventory(int year)
        {
            return Lib_Primavera.PriIntegration.getInventoryTotals(year);
        }

        // GET api/inventory   
        public List<Lib_Primavera.Model.Stock> GetInventory(int year, int month)
        {
            return Lib_Primavera.PriIntegration.getInventoryTotals(year, month);
        }

        /* Total do valor do inventario
        // GET api/inventory   
        public double GetInventoryTotalValue(int year, int month)
        {
            List<Lib_Primavera.Model.Stock> ss = Lib_Primavera.PriIntegration.getInventoryTotals(year.ToString());
            double re = 0;
            foreach (Lib_Primavera.Model.Stock s in ss){
                re += s.TotalValue;
            }
            return re;
        }*/
    }
}
