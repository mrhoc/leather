$(document).ready(function () {
    $('.mb-menu').html($('#menu-desktop').html());
    $('.btn-menu-mb').on('click', function () {
        $('#wandave-theme').toggleClass('menu-active');
        $(this).toggleClass('active');
    });
    $('#wanda-close-handle').on('click', function () {
        $('#wandave-theme').removeClass('menu-active');
        
    });
    if($(window).width() < 992) {
        $('.mb-menu li > a').on('click', function (e) {
            e.preventDefault();
            $(this).parent().toggleClass('active');
            $(this).closest('li').find('.sub_menu_dropdown').slideToggle('fast');
        })
    }

    // Tab functionality for home-tab-col
    initHomeTabs();
});

// Home Tab Collection functionality
function initHomeTabs() {
    const $tabContainer = $('#home-tab-col');
    const $tabPanes = $('.tab-result .tab-pane');
    
    // Handle tab clicks
    $tabContainer.on('click', 'a[role="tab"]', function(e) {
        e.preventDefault();
        
        const $this = $(this);
        const targetId = $this.attr('href');
        const dataUrl = $this.data('url');
        
        // Remove active class from all tabs and add to current
        $tabContainer.find('a[role="tab"]').removeClass('active success-ajax');
        $this.addClass('active success-ajax');
        
        // Hide all tab panes and show target
        $tabPanes.removeClass('show').hide();
        $(targetId).addClass('show').show();
        
        // Load content via AJAX if data-url exists and tab is empty
        if (dataUrl && $(targetId).is(':empty')) {
            loadTabContent(targetId, dataUrl);
        }
    });
    
    // Initialize first tab as active
    const $firstTab = $tabContainer.find('a[role="tab"]:first');
    const $firstPane = $($firstTab.attr('href'));
    
    if ($firstTab.length && $firstPane.length) {
        $firstTab.addClass('active success-ajax');
        $firstPane.addClass('show').show();
        
        // Load first tab content if empty
        const firstDataUrl = $firstTab.data('url');
        if (firstDataUrl && $firstPane.is(':empty')) {
            loadTabContent($firstPane.attr('id'), firstDataUrl);
        }
    }
}

// Load tab content via AJAX
function loadTabContent(tabId, url) {
    const $tabPane = $('#' + tabId);
    
    // Show loading state
    $tabPane.html('<div class="tab-loading"><div class="loading-spinner"></div><p>Đang tải...</p></div>');
    
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'html',
        success: function(response) {
            // Extract content from response (assuming it returns HTML with product grid)
            let content = response;
            
            // If response contains specific tab content, extract it
            if (response.includes('tab-pane') || response.includes('product-block')) {
                // Try to find product grid content
                const $tempDiv = $('<div>').html(response);
                const $productGrid = $tempDiv.find('.d-flex.d-flex-wrap.row-left-list, .product-grid, .products-grid');
                
                if ($productGrid.length) {
                    content = $productGrid.parent().html();
                }
            }
            
            $tabPane.html(content);
            
            // Initialize any lazy loading or product interactions
            initProductInteractions($tabPane);
            
        },
        error: function(xhr, status, error) {
            console.error('Error loading tab content:', error);
            $tabPane.html(`
                <div class="tab-error">
                    <i class="fa fa-exclamation-triangle"></i>
                    <p>Không thể tải nội dung. Vui lòng thử lại sau.</p>
                    <button class="btn-retry" onclick="loadTabContent('${tabId}', '${url}')">Thử lại</button>
                </div>
            `);
        }
    });
}

// Initialize product interactions for loaded content
function initProductInteractions($container) {
    // Initialize lazy loading for images
    if (typeof LazyLoad !== 'undefined') {
        new LazyLoad({
            elements_selector: '.lazyload'
        });
    }
    
    // Initialize quick view functionality
    $container.find('.btn_quickview').off('click').on('click', function() {
        const productUrl = $(this).data('url');
        if (productUrl) {
            openQuickView(productUrl);
        }
    });
    
    // Initialize product hover effects
    $container.find('.product-img.has-hover').off('mouseenter mouseleave').on({
        mouseenter: function() {
            $(this).find('.img-hover').show();
            $(this).find('.img-first').hide();
        },
        mouseleave: function() {
            $(this).find('.img-hover').hide();
            $(this).find('.img-first').show();
        }
    });
}

// Quick view functionality
function openQuickView(productUrl) {
    // You can implement modal or popup here
    console.log('Opening quick view for:', productUrl);
    
    // Example: Open in new tab for now
    // window.open(productUrl, '_blank');
    
    // Or implement a modal:
    // $('#quickViewModal').modal('show');
    // $('#quickViewModal .modal-body').load(productUrl + '?view=quick-view');
}

// $(document).on('click', '.menu-active #site-overlay,#wanda-close-handle', function (event) {
//     $("#wandave-theme").removeClass('menu-active');
// });
// $("body").on("click", ".btn-menu-mb", function () {
//     $("body").toggleClass('menu-active');
// })
// $('body').on('click', '.cl-open', function (event) {
//     $(this).next().slideToggle('fast')
//     $(this).toggleClass('minus-menu');
// });