<?php
class ControllerExtensionModuleFilter extends Controller {
	public function index($data = array()) {
		if (isset($this->request->get['path'])) {
			$parts = explode('_', (string)$this->request->get['path']);
		} else {
			$parts = array();
		}

		$category_id = end($parts);

		$this->load->model('catalog/category');

		$category_info = $this->model_catalog_category->getCategory($category_id);

		if ($category_info) {
			$this->load->language('extension/module/filter');

			$url = '';

			if (isset($this->request->get['sort'])) {
				$url .= '&sort=' . $this->request->get['sort'];
			}

			if (isset($this->request->get['order'])) {
				$url .= '&order=' . $this->request->get['order'];
			}

			if (isset($this->request->get['limit'])) {
				$url .= '&limit=' . $this->request->get['limit'];
			}

			$data['action'] = str_replace('&amp;', '&', $this->url->link('product/category', 'path=' . $this->request->get['path'] . $url));

			if (isset($this->request->get['filter'])) {
				$data['filter_category'] = explode(',', $this->request->get['filter']);
			} else {
				$data['filter_category'] = array();
			}

			$this->load->model('catalog/product');

			$data['filter_groups'] = array();

			$filter_groups = $this->model_catalog_category->getCategoryFilters($category_id);

			if ($filter_groups) {
				foreach ($filter_groups as $filter_group) {
					$childen_data = array();

					foreach ($filter_group['filter'] as $filter) {
						$filter_data = array(
							'filter_category_id' => $category_id,
							'filter_filter'      => $filter['filter_id']
						);

						$childen_data[] = array(
							'filter_id' => $filter['filter_id'],
							'name'      => '<p>' . $filter['name'] . '</p>' . ($this->config->get('config_product_count') || true ? '<span>' . $this->model_catalog_product->getTotalProducts($filter_data) . '</span>' : '')
						);
					}

					$data['filter_groups'][] = array(
						'filter_group_id' => $filter_group['filter_group_id'],
						'name'            => $filter_group['name'],
						'filter'          => $childen_data
					);
				}

                $price = $this->model_catalog_product->getProductsPrice($category_id);

                $p_min = isset($price['min'])? $price['min']: 0;
                $p_max = isset($price['max'])? $price['max']: 0;

                $p_from = isset($this->request->get['p_min'])? (int)$this->request->get['p_min']: $p_min;
                $p_to = isset($this->request->get['p_max'])? (int)$this->request->get['p_max']: $p_max;

                $filter_price = isset($this->request->get['p_min'], $this->request->get['p_max'])? '&p_min=' . $p_from . '&p_max=' . $p_to: '';

                $data['price'] = [
                        'min'          => $p_min,
                        'max'          => $p_max,
                        'from'         => $p_from,
                        'to'           => $p_to,
                        'filter_price' => $filter_price,
                        'symbol_left'  => $this->currency->getSymbolLeft($this->session->data['currency']),
                        'symbol_right' => $this->currency->getSymbolRight($this->session->data['currency']),
                    ];

				return $this->load->view('extension/module/filter', $data);
			}
		}
	}
}