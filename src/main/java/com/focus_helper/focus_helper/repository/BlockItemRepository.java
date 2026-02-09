package com.focus_helper.focus_helper.repository;

import com.focus_helper.focus_helper.model.BlockItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlockItemRepository extends JpaRepository<BlockItem, Long> {
}
