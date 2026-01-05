using ChineseSale.Dtos;
using ChineseSale.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetCategoryDto>>> GetAllCategoryAsync()
        {
            var categorys = await _categoryService.GetAllCategoryAsync();
            return Ok(categorys);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<GetCategoryByIdDto>> GetCategoryByIdAsync(int Id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(Id);
                return Ok(category);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Add")]
        public async Task<ActionResult<GetCategoryDto>> CreateCategoryAsync(CreateCategorDto categoryDto)
        {
            try
            {
                var category = await _categoryService.CreateCategoryAsync(categoryDto);
                return Ok(category);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Update")]
        public async Task<ActionResult<GetCategoryByIdDto>> UpdateCategoryAsync(UpdateCategoryDto categoryDto)
        {
            try
            {
                var category = await _categoryService.UpdateCategoryAsync(categoryDto);
                return Ok(category);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(int Id)
        {
            try
            {
                bool result = await _categoryService.DeleteCategoryAsync(Id);
                if (result)
                    return Ok("Category deleted successfully");
                else
                    return BadRequest("Failed to delete category");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}