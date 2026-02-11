using ChineseSale.Dtos;
using ChineseSale.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(ICategoryService categoryService, ILogger<CategoryController> logger)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetCategoryDto>>> GetAllCategoryAsync()
        {
            _logger.LogInformation("Getting all categories.");
            var categories = await _categoryService.GetAllCategoryAsync();
            return Ok(categories);
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<GetCategoryByIdDto>> GetCategoryByIdAsync(int Id)
        {
            _logger.LogInformation($"Entering function to get category with ID: {Id}");
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(Id);
                _logger.LogInformation($"Successfully retrieved category with ID: {Id}");
                return Ok(category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving category with ID: {Id}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("Add")]
        public async Task<ActionResult<GetCategoryDto>> CreateCategoryAsync(CreateCategorDto categoryDto)
        {
            _logger.LogInformation("Entering function to create a new category.");
            try
            {
                var category = await _categoryService.CreateCategoryAsync(categoryDto);
                _logger.LogInformation("Category created successfully.");
                return Ok(category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category.");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("Update")]
        public async Task<ActionResult<GetCategoryByIdDto>> UpdateCategoryAsync(UpdateCategoryDto categoryDto)
        {
            _logger.LogInformation($"Entering function to update category with ID: {categoryDto.Id}");
            try
            {
                var category = await _categoryService.UpdateCategoryAsync(categoryDto);
                _logger.LogInformation("Category updated successfully.");
                return Ok(category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating category.");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(int Id)
        {
            _logger.LogInformation($"Entering function to delete category with ID: {Id}");
            try
            {
                bool result = await _categoryService.DeleteCategoryAsync(Id);
                if (result)
                {
                    _logger.LogInformation("Category deleted successfully.");
                    return Ok("Category deleted successfully.");
                }
                else
                {
                    _logger.LogWarning("Failed to delete category.");
                    return BadRequest("Failed to delete category.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category.");
                return BadRequest(ex.Message);
            }
        }
    }
}
